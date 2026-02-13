"""Authentication endpoints."""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.logging import get_logger
from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.schemas.auth import Token, User, UserLogin

router = APIRouter()
logger = get_logger(__name__)

# Mock user database - in production, use a real database
MOCK_USERS = {
    "admin": {
        "username": "admin",
        "email": "admin@example.com",
        "hashed_password": get_password_hash("admin123"),
        "is_active": True,
    },
    "user": {
        "username": "user",
        "email": "user@example.com",
        "hashed_password": get_password_hash("user123"),
        "is_active": True,
    },
}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint to get access token.

    Args:
        form_data: OAuth2 form with username and password

    Returns:
        Token with access_token

    Raises:
        HTTPException: If authentication fails
    """
    user = MOCK_USERS.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        logger.warning("login_failed", username=form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )

    logger.info("login_successful", username=user["username"])
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def read_users_me():
    """Get current authenticated user info.

    Note: This is a placeholder endpoint. The actual get_current_user
    dependency would be used here.
    """
    # This would normally use the get_current_user dependency
    # For now, return a mock response
    return User(username="admin", email="admin@example.com")
