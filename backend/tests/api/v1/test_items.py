"""Test items endpoints."""

# TODO: Replace with your own feature tests
# This is a placeholder test file - remove or replace with your feature tests

import pytest
from fastapi.testclient import TestClient


class TestItemsEndpoints:
    """Test items CRUD endpoints."""

    @pytest.fixture
    def auth_headers(self, client: TestClient):
        """Get auth headers with valid token."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "test_user", "password": "user123"},
        )
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_read_items(self, client: TestClient, db_session, auth_headers):
        """Test reading all items."""
        from app.models import Item

        test_item = Item(name="Test Item", price=10.00)
        db_session.add(test_item)
        db_session.commit()

        response = client.get("/api/v1/items", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_read_items_unauthorized(self, client: TestClient):
        """Test reading items without auth returns 401."""
        response = client.get("/api/v1/items")
        assert response.status_code == 401

    def test_create_item(self, client: TestClient, auth_headers):
        """Test creating a new item."""
        item_data = {"name": "New Item", "price": 29.99}
        response = client.post("/api/v1/items", json=item_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] is not None
        assert data["name"] == "New Item"
        assert data["price"] == 29.99

    def test_create_item_unauthorized(self, client: TestClient):
        """Test creating an item without auth returns 401."""
        item_data = {"name": "New Item", "price": 29.99}
        response = client.post("/api/v1/items", json=item_data)
        assert response.status_code == 401

    def test_create_item_validation_error(self, client: TestClient, auth_headers):
        """Test that invalid data is rejected."""
        response = client.post("/api/v1/items", json={"invalid": "data"}, headers=auth_headers)
        assert response.status_code == 422

    def test_read_item(self, client: TestClient, db_session, auth_headers):
        """Test reading an item by ID."""
        from app.models import Item

        test_item = Item(name="Test Item", price=10.00)
        db_session.add(test_item)
        db_session.commit()
        db_session.refresh(test_item)

        response = client.get(f"/api/v1/items/{test_item.id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == test_item.id
        assert data["name"] == "Test Item"
        assert data["price"] == 10.00

    def test_read_item_not_found(self, client: TestClient, auth_headers):
        """Test reading a non-existent item returns 404."""
        response = client.get("/api/v1/items/99999", headers=auth_headers)
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"

    def test_read_item_unauthorized(self, client: TestClient):
        """Test reading an item without auth returns 401."""
        response = client.get("/api/v1/items/1")
        assert response.status_code == 401

    def test_update_item(self, client: TestClient, db_session, auth_headers):
        """Test updating an item."""
        from app.models import Item

        test_item = Item(name="Original", price=10.00)
        db_session.add(test_item)
        db_session.commit()
        db_session.refresh(test_item)

        update_data = {"name": "Updated", "price": 25.00}
        response = client.put(
            f"/api/v1/items/{test_item.id}", json=update_data, headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated"
        assert data["price"] == 25.00

    def test_update_item_not_found(self, client: TestClient, auth_headers):
        """Test updating a non-existent item returns 404."""
        response = client.put(
            "/api/v1/items/99999", json={"name": "Test", "price": 10}, headers=auth_headers
        )
        assert response.status_code == 404

    def test_update_item_unauthorized(self, client: TestClient, db_session, auth_headers):
        """Test updating an item without auth returns 401."""
        from app.models import Item

        test_item = Item(name="Test", price=10.00)
        db_session.add(test_item)
        db_session.commit()

        response = client.put(f"/api/v1/items/{test_item.id}", json={"name": "Test", "price": 10})
        assert response.status_code == 401

    def test_delete_item(self, client: TestClient, db_session, auth_headers):
        """Test deleting an item."""
        from app.models import Item

        test_item = Item(name="To Delete", price=10.00)
        db_session.add(test_item)
        db_session.commit()
        db_session.refresh(test_item)
        item_id = test_item.id

        response = client.delete(f"/api/v1/items/{item_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Item deleted successfully"

        # Verify item is deleted
        get_response = client.get(f"/api/v1/items/{item_id}", headers=auth_headers)
        assert get_response.status_code == 404

    def test_delete_item_not_found(self, client: TestClient, auth_headers):
        """Test deleting a non-existent item returns 404."""
        response = client.delete("/api/v1/items/99999", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_item_unauthorized(self, client: TestClient, db_session):
        """Test deleting an item without auth returns 401."""
        from app.models import Item

        test_item = Item(name="Test", price=10.00)
        db_session.add(test_item)
        db_session.commit()

        response = client.delete(f"/api/v1/items/{test_item.id}")
        assert response.status_code == 401
