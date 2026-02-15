"""Authentication endpoints."""

from datetime import UTC, datetime, timedelta
from typing import Annotated
from uuid import uuid4

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt import PyJWTError as JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.database import get_db
from app.models import User
from app.schemas.auth import SignupResponse, Token, UserSignup
from app.schemas.auth import User as UserSchema
from app.services.email import send_confirmation_email

router = APIRouter()
logger = get_logger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_current_active_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
) -> User:
    """Get current active user from token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception from None

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Login endpoint to get access token."""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning("login_failed", username=form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        logger.warning("login_inactive", username=form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not activated. Please confirm your email.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    logger.info("login_successful", username=user.username)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserSchema)
def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    """Get current authenticated user info."""
    return UserSchema(
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active,
    )


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(
    user_data: UserSignup,
    db: Session = Depends(get_db),
):
    """Register a new user and send confirmation email."""
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    confirmation_token = str(uuid4())
    token_expires = datetime.now(UTC) + timedelta(hours=24)

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        is_active=False,
        confirmation_token=confirmation_token,
        confirmation_token_expires=token_expires,
    )

    db.add(new_user)
    db.commit()

    confirmation_url = f"{settings.CORS_ORIGINS[0]}/confirm-signup?token={confirmation_token}"
    send_confirmation_email(user_data.email, user_data.username, confirmation_url)

    logger.info("user_signed_up", username=user_data.username, email=user_data.email)
    return SignupResponse(
        message="Account created. Please check your email to confirm your account."
    )


@router.get("/confirm/{token}")
def confirm_signup(
    token: str,
    db: Session = Depends(get_db),
):
    """Confirm user email and activate account."""
    user = db.query(User).filter(User.confirmation_token == token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid confirmation token",
        )

    if user.is_active:
        return {"message": "Account already confirmed"}

    if user.confirmation_token_expires and user.confirmation_token_expires < datetime.now(UTC):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Confirmation token has expired",
        )

    user.is_active = True
    user.confirmation_token = None
    user.confirmation_token_expires = None
    db.commit()

    logger.info("user_confirmed", username=user.username)
    return {"message": "Account confirmed successfully"}
