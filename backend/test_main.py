import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from FastAPI!"}


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_read_item(client):
    response = client.get("/api/items/42")
    assert response.status_code == 200
    assert response.json() == {"item_id": 42, "q": None}


def test_read_item_with_query(client):
    response = client.get("/api/items/42?q=test")
    assert response.status_code == 200
    assert response.json() == {"item_id": 42, "q": "test"}


def test_create_item(client):
    item_data = {"name": "Test Item", "price": 29.99}
    response = client.post("/api/items", json=item_data)
    assert response.status_code == 200
    assert response.json() == {"message": "Item created", "item": item_data}


def test_create_item_empty(client):
    response = client.post("/api/items", json={})
    assert response.status_code == 200
    assert response.json() == {"message": "Item created", "item": {}}
