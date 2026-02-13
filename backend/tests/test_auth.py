"""Test authentication and JWT functionality."""

import pytest
from fastapi.testclient import TestClient

from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)


class TestPasswordHashing:
    """Test password hashing functions."""

    def test_password_hashing(self):
        """Test that password hashing and verification work."""
        password = "test_password123"
        hashed = get_password_hash(password)

        # Verify the hashed password is different from plain text
        assert hashed != password

        # Verify the password can be verified
        assert verify_password(password, hashed) is True

        # Verify wrong password fails
        assert verify_password("wrong_password", hashed) is False

    def test_verify_password_with_invalid_hash(self):
        """Test verify_password with invalid hash."""
        assert verify_password("password", "invalid_hash") is False


class TestJWTToken:
    """Test JWT token creation and validation."""

    def test_create_access_token(self):
        """Test creating a JWT access token."""
        data = {"sub": "testuser"}
        token = create_access_token(data)

        # Token should be a non-empty string
        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_valid_token(self):
        """Test decoding a valid JWT token."""
        data = {"sub": "testuser"}
        token = create_access_token(data)

        decoded = decode_access_token(token)
        assert decoded is not None
        assert decoded["sub"] == "testuser"

    def test_decode_invalid_token(self):
        """Test decoding an invalid JWT token."""
        decoded = decode_access_token("invalid.token.here")
        assert decoded is None

    def test_decode_expired_token(self):
        """Test decoding an expired JWT token."""
        from datetime import timedelta

        data = {"sub": "testuser"}
        # Create a token that expires in -1 minute (already expired)
        token = create_access_token(data, expires_delta=timedelta(minutes=-1))

        decoded = decode_access_token(token)
        assert decoded is None


class TestAuthEndpoints:
    """Test authentication endpoints."""

    def test_decode_token_with_missing_subject(self):
        """Test decoding a token with missing subject."""
        from app.core.security import create_access_token, decode_access_token

        # Create a token without 'sub' claim
        token = create_access_token(data={})
        decoded = decode_access_token(token)

        # Token should be valid but have no subject
        assert decoded is not None
        assert decoded.get("sub") is None

    def test_login_success(self, client: TestClient):
        """Test successful login."""
        response = client.post(
            "/api/v1/auth/login", data={"username": "admin", "password": "admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0

    def test_login_wrong_password(self, client: TestClient):
        """Test login with wrong password."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "admin", "password": "wrongpassword"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Incorrect username or password"

    def test_login_nonexistent_user(self, client: TestClient):
        """Test login with non-existent user."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "nonexistent", "password": "password"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Incorrect username or password"

    def test_read_users_me(self, client: TestClient):
        """Test reading current user info."""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "admin"
        assert data["email"] == "admin@example.com"


class TestProtectedEndpoints:
    """Test protected endpoints requiring authentication."""

    def test_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/items/protected-items")
        assert response.status_code == 401
        assert response.json()["detail"] == "Not authenticated"

    def test_protected_endpoint_with_valid_token(self, client: TestClient):
        """Test accessing protected endpoint with valid token."""
        # First login to get token
        login_response = client.post(
            "/api/v1/auth/login", data={"username": "admin", "password": "admin123"}
        )
        token = login_response.json()["access_token"]

        # Access protected endpoint with token
        response = client.get(
            "/api/v1/items/protected-items",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "Hello admin" in data["message"]
        assert "items" in data

    def test_protected_endpoint_with_invalid_token(self, client: TestClient):
        """Test accessing protected endpoint with invalid token."""
        response = client.get(
            "/api/v1/items/protected-items",
            headers={"Authorization": "Bearer invalid_token"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Could not validate credentials"
