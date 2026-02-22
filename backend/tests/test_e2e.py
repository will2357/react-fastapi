"""E2E integration tests for the backend API."""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpointsE2E:
    """E2E tests for health check endpoints."""

    def test_health_check_no_db(self, client: TestClient):
        """Test the async health check endpoint that doesn't check DB."""
        response = client.get("/api/v1/health/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_health_check_with_db(self, client: TestClient):
        """Test the sync health check endpoint that verifies DB connection."""
        response = client.get("/api/v1/health/db")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"


class TestAuthEndpointsE2E:
    """E2E tests for authentication endpoints."""

    def test_login_with_seeded_user(self, client: TestClient):
        """Test login with the seeded e2e_user."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "e2e_user", "password": "e2e123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "wrong_user", "password": "wrong_password"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Incorrect username or password"

    def test_protected_endpoint_with_token(self, client: TestClient):
        """Test accessing protected endpoint with valid token."""
        # Login first
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "e2e_user", "password": "e2e123"},
        )
        token = login_response.json()["access_token"]

        # Access protected endpoint
        response = client.get(
            "/api/v1/items",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/items")
        assert response.status_code == 401


class TestSignupEndpointsE2E:
    """E2E tests for signup endpoints."""

    def test_signup_and_confirm_flow(self, client: TestClient, db_session):
        """Test complete signup and confirmation flow."""
        from app.models import User

        # Step 1: Signup new user
        signup_response = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "e2e_signup_user",
                "email": "e2e_signup@example.com",
                "password": "signup123",
            },
        )
        assert signup_response.status_code == 201
        assert "message" in signup_response.json()

        # Step 2: Find the user and their confirmation token
        user = db_session.query(User).filter(User.username == "e2e_signup_user").first()
        assert user is not None
        assert user.is_active is False
        assert user.confirmation_token is not None

        # Step 3: Confirm signup with token
        confirm_response = client.get(f"/api/v1/auth/confirm/{user.confirmation_token}")
        assert confirm_response.status_code == 200  # Returns JSON response
        assert confirm_response.json()["message"] == "Account confirmed successfully"

        # Step 4: Verify user is now active
        db_session.refresh(user)
        assert user.is_active is True
        assert user.confirmation_token is None

        # Step 5: Login should now work
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "e2e_signup_user", "password": "signup123"},
        )
        assert login_response.status_code == 200
        assert "access_token" in login_response.json()

    def test_signup_duplicate_username_email(self, client: TestClient):
        """Test signup with duplicate username and email."""
        # First signup
        client.post(
            "/api/v1/auth/signup",
            json={
                "username": "duplicate_test",
                "email": "duplicate@example.com",
                "password": "password123",
            },
        )

        # Try duplicate username
        response1 = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "duplicate_test",
                "email": "another@example.com",
                "password": "password123",
            },
        )
        assert response1.status_code == 400
        assert response1.json()["detail"] == "Username already taken"

        # Try duplicate email
        response2 = client.post(
            "/api/v1/auth/signup",
            json={
                "username": "another_user",
                "email": "duplicate@example.com",
                "password": "password123",
            },
        )
        assert response2.status_code == 400
        assert response2.json()["detail"] == "Email already registered"


class TestItemsEndpointsE2E:
    """E2E tests for items endpoints."""

    # TODO: Replace with your own feature tests
    # This is a placeholder test class - remove or replace with your feature tests

    @pytest.fixture
    def auth_headers(self, client: TestClient):
        """Get auth headers with valid token."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "e2e_user", "password": "e2e123"},
        )
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_create_item(self, client: TestClient, auth_headers):
        """Test creating a new item."""
        item_data = {"name": "E2E Test Item", "price": 99.99}
        response = client.post("/api/v1/items", json=item_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] is not None
        assert data["name"] == "E2E Test Item"
        assert data["price"] == 99.99

    def test_read_item(self, client: TestClient, auth_headers):
        """Test reading an item by ID."""
        # First create an item
        item_data = {"name": "Read Test Item", "price": 50.00}
        create_response = client.post("/api/v1/items", json=item_data, headers=auth_headers)
        item_id = create_response.json()["item_id"]

        # Then read it
        response = client.get(f"/api/v1/items/{item_id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == item_id
        assert data["name"] == "Read Test Item"
        assert data["price"] == 50.00

    def test_read_nonexistent_item(self, client: TestClient, auth_headers):
        """Test reading a non-existent item returns 404."""
        response = client.get("/api/v1/items/99999", headers=auth_headers)
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"

    def test_create_item_validation_error(self, client: TestClient, auth_headers):
        """Test that invalid item data is rejected."""
        response = client.post("/api/v1/items", json={"invalid": "data"}, headers=auth_headers)
        assert response.status_code == 422
