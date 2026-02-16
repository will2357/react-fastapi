"""Test authentication and JWT functionality."""

from datetime import UTC, datetime, timedelta

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
            "/api/v1/auth/login", data={"username": "test_admin", "password": "admin123"}
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
            data={"username": "test_admin", "password": "wrongpassword"},
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
        # First login to get token
        login_response = client.post(
            "/api/v1/auth/login", data={"username": "test_admin", "password": "admin123"}
        )
        token = login_response.json()["access_token"]

        # Get current user info
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "test_admin"
        assert data["email"] == "test_admin@example.com"


class TestProtectedEndpoints:
    """Test protected endpoints requiring authentication."""

    def test_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/items")
        assert response.status_code == 401
        assert response.json()["detail"] == "Not authenticated"

    def test_protected_endpoint_with_valid_token(self, client: TestClient):
        """Test accessing protected endpoint with valid token."""
        # First login to get token
        login_response = client.post(
            "/api/v1/auth/login", data={"username": "test_admin", "password": "admin123"}
        )
        token = login_response.json()["access_token"]

        # Access protected endpoint with token
        response = client.get(
            "/api/v1/items",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_protected_endpoint_with_invalid_token(self, client: TestClient):
        """Test accessing protected endpoint with invalid token."""
        response = client.get(
            "/api/v1/items",
            headers={"Authorization": "Bearer invalid_token"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Could not validate credentials"


class TestSignupEndpoint:
    """Test user signup endpoint."""

    def test_signup_success(self, client: TestClient):
        """Test successful user signup."""
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "newpassword123",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert "message" in data
        assert "email" in data["message"].lower() or "confirm" in data["message"].lower()

    def test_signup_duplicate_username(self, client: TestClient):
        """Test signup with duplicate username."""
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "test_admin",
                "email": "different@example.com",
                "password": "password123",
            },
        )
        assert response.status_code == 400
        assert response.json()["detail"] == "Username already taken"

    def test_signup_duplicate_email(self, client: TestClient):
        """Test signup with duplicate email."""
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "newuser2",
                "email": "test_admin@example.com",
                "password": "password123",
            },
        )
        assert response.status_code == 400
        assert response.json()["detail"] == "Email already registered"

    def test_signup_inactive_user_cannot_login(self, client: TestClient, db_session):
        """Test that signup creates inactive user who cannot login."""
        # Signup new user
        signup_response = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "inactive_user",
                "email": "inactive@example.com",
                "password": "password123",
            },
        )
        assert signup_response.status_code == 201

        # Try to login - should fail because user is inactive
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "inactive_user", "password": "password123"},
        )
        assert login_response.status_code == 401
        assert "activate" in login_response.json()["detail"].lower()


class TestConfirmSignupEndpoint:
    """Test email confirmation endpoint."""

    def test_confirm_signup_success(self, client: TestClient, db_session):
        """Test successful email confirmation."""
        from app.core.security import get_password_hash
        from app.models import User

        # Create user with confirmation token directly in DB
        user = User(
            username="confirm_user",
            email="confirm@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=False,
            confirmation_token="test-token-123",
        )
        db_session.add(user)
        db_session.commit()

        # Confirm signup
        response = client.get("/api/v1/auth/confirm/test-token-123")
        assert response.status_code == 200  # Returns JSON response
        assert response.json()["message"] == "Account confirmed successfully"

        # Check user is now active
        db_session.refresh(user)
        assert user.is_active is True
        assert user.confirmation_token is None

    def test_confirm_signup_invalid_token(self, client: TestClient):
        """Test confirmation with invalid token."""
        response = client.get("/api/v1/auth/confirm/invalid-token")
        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid confirmation token"

    def test_confirm_signup_already_confirmed(self, client: TestClient, db_session):
        """Test confirming already confirmed user returns success."""
        from app.core.security import get_password_hash
        from app.models import User

        user = User(
            username="already_confirmed",
            email="already@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=True,
            confirmation_token="already-used-token",
        )
        db_session.add(user)
        db_session.commit()

        response = client.get("/api/v1/auth/confirm/already-used-token")
        assert response.status_code == 200
        assert "message" in response.json()

    def test_confirm_signup_expired_token(self, client: TestClient, db_session):
        """Test confirmation with expired token."""
        from app.core.security import get_password_hash
        from app.models import User

        user = User(
            username="expired_token_user",
            email="expired@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=False,
            confirmation_token="expired-token-123",
            confirmation_token_expires=datetime.now(UTC) - timedelta(hours=1),
        )
        db_session.add(user)
        db_session.commit()

        response = client.get("/api/v1/auth/confirm/expired-token-123")
        assert response.status_code == 400
        assert response.json()["detail"] == "Confirmation token has expired"

    def test_confirm_signup_activate_user_can_login(self, client: TestClient, db_session):
        """Test that confirmed user can login."""
        from app.core.security import get_password_hash
        from app.models import User

        # Create user with confirmation token
        user = User(
            username="login_after_confirm",
            email="loginconfirm@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=False,
            confirmation_token="confirm-token-456",
        )
        db_session.add(user)
        db_session.commit()

        # Confirm signup - don't follow redirects
        client.get("/api/v1/auth/confirm/confirm-token-456", follow_redirects=False)

        # Now login should work
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "login_after_confirm", "password": "password123"},
        )
        assert login_response.status_code == 200
        assert "access_token" in login_response.json()
