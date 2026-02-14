"""E2E integration tests for the backend API."""

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
            "/api/v1/items/protected-items",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "Hello e2e_user" in data["message"]
        assert "items" in data

    def test_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/items/protected-items")
        assert response.status_code == 401


class TestItemsEndpointsE2E:
    """E2E tests for items endpoints."""

    def test_create_item(self, client: TestClient):
        """Test creating a new item."""
        item_data = {"name": "E2E Test Item", "price": 99.99}
        response = client.post("/api/v1/items/items", json=item_data)
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] is not None
        assert data["name"] == "E2E Test Item"
        assert data["price"] == 99.99

    def test_read_item(self, client: TestClient):
        """Test reading an item by ID."""
        # First create an item
        item_data = {"name": "Read Test Item", "price": 50.00}
        create_response = client.post("/api/v1/items/items", json=item_data)
        item_id = create_response.json()["item_id"]

        # Then read it
        response = client.get(f"/api/v1/items/items/{item_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == item_id
        assert data["name"] == "Read Test Item"
        assert data["price"] == 50.00

    def test_read_nonexistent_item(self, client: TestClient):
        """Test reading a non-existent item returns 404."""
        response = client.get("/api/v1/items/items/99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"

    def test_create_item_validation_error(self, client: TestClient):
        """Test that invalid item data is rejected."""
        response = client.post("/api/v1/items/items", json={"invalid": "data"})
        assert response.status_code == 422
