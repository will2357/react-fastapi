"""Authentication dependencies."""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.logging import get_logger
from app.core.security import decode_access_token
from app.schemas.auth import User

logger = get_logger(__name__)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get the current authenticated user from the JWT token.

    Args:
        token: JWT token from the Authorization header

    Returns:
        User object if token is valid

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        logger.warning("invalid_token_received")
        raise credentials_exception

    username: str | None = payload.get("sub")
    if username is None:
        logger.warning("token_missing_subject")
        raise credentials_exception

    # In a real app, you would fetch the user from the database here
    # For now, we'll create a mock user
    user = User(username=username)
    logger.info("user_authenticated", username=username)
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get the current active user.

    Args:
        current_user: User from get_current_user dependency

    Returns:
        User object if active

    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        logger.warning("inactive_user_access_attempt", username=current_user.username)
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
