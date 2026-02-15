"""Test authentication dependencies."""

import asyncio

import pytest
from fastapi import HTTPException

from app.api.deps import get_current_active_user, get_current_user
from app.core.security import create_access_token
from app.schemas.auth import User


class TestGetCurrentUser:
    """Test get_current_user dependency."""

    def test_get_current_user_valid_token(self):
        """Test get_current_user with valid token."""
        token = create_access_token({"sub": "testuser"})
        user = asyncio.run(get_current_user(token))
        assert isinstance(user, User)
        assert user.username == "testuser"

    def test_get_current_user_invalid_token(self):
        """Test get_current_user with invalid token."""
        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(get_current_user("invalid_token"))
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Could not validate credentials"

    def test_get_current_user_missing_subject(self):
        """Test get_current_user with token missing subject."""
        token = create_access_token({})
        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(get_current_user(token))
        assert exc_info.value.status_code == 401


class TestGetCurrentActiveUser:
    """Test get_current_active_user dependency."""

    def test_get_current_active_user_active(self):
        """Test get_current_active_user with active user."""
        token = create_access_token({"sub": "testuser"})
        user = asyncio.run(get_current_user(token))
        active_user = asyncio.run(get_current_active_user(user))
        assert active_user.username == "testuser"
        assert active_user.is_active is True

    def test_get_current_active_user_inactive(self):
        """Test get_current_active_user with inactive user."""
        inactive_user = User(username="inactive_user", is_active=False)
        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(get_current_active_user(inactive_user))
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Inactive user"
