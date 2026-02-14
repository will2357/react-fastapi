"""Test items endpoints."""

from fastapi.testclient import TestClient


class TestItemsEndpoints:
    """Test items CRUD endpoints."""

    def test_read_item(self, client: TestClient, db_session):
        """Test reading an item by ID."""
        from app.models import Item

        test_item = Item(name="Test Item", price=10.00)
        db_session.add(test_item)
        db_session.commit()
        db_session.refresh(test_item)

        response = client.get(f"/api/v1/items/items/{test_item.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == test_item.id
        assert data["name"] == "Test Item"
        assert data["price"] == 10.00

    def test_read_item_not_found(self, client: TestClient):
        """Test reading a non-existent item returns 404."""
        response = client.get("/api/v1/items/items/99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"

    def test_create_item(self, client: TestClient):
        """Test creating a new item."""
        item_data = {"name": "New Item", "price": 29.99}
        response = client.post("/api/v1/items/items", json=item_data)
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] is not None
        assert data["name"] == "New Item"
        assert data["price"] == 29.99

    def test_create_item_validation_error(self, client: TestClient):
        """Test that invalid data is rejected."""
        response = client.post("/api/v1/items/items", json={"invalid": "data"})
        assert response.status_code == 422
