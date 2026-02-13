"""Test health endpoint."""

from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Test health check endpoint."""

    def test_health_check(self, client: TestClient):
        response = client.get("/api/v1/health/")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}
