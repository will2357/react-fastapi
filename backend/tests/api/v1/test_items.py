"""Test items endpoints."""

from fastapi.testclient import TestClient


class TestItemsEndpoints:
    """Test items CRUD endpoints."""

    def test_read_item(self, client: TestClient):
        response = client.get("/api/v1/items/items/42")
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == 42
        assert data["q"] is None

    def test_read_item_with_query(self, client: TestClient):
        response = client.get("/api/v1/items/items/42?q=test")
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == 42
        assert data["q"] == "test"

    def test_create_item(self, client: TestClient):
        item_data = {"name": "Test Item", "price": 29.99}
        response = client.post("/api/v1/items/items", json=item_data)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Item created"
        assert data["item"]["name"] == "Test Item"
        assert data["item"]["price"] == 29.99

    def test_create_item_validation_error(self, client: TestClient):
        """Test that invalid data is rejected."""
        response = client.post("/api/v1/items/items", json={"invalid": "data"})
        assert response.status_code == 422  # Validation error
