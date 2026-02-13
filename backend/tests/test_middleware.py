"""Test middleware functionality."""

from fastapi.testclient import TestClient


class TestMiddleware:
    """Test middleware functionality."""

    def test_request_timing_header(self, client: TestClient):
        """Test that X-Process-Time header is added to response."""
        response = client.get("/")
        assert "x-process-time" in response.headers
        process_time = float(response.headers["x-process-time"])
        assert process_time >= 0

    def test_security_headers(self, client: TestClient):
        """Test that security headers are added to response."""
        response = client.get("/")
        assert response.headers["x-content-type-options"] == "nosniff"
        assert response.headers["x-frame-options"] == "DENY"
        assert response.headers["x-xss-protection"] == "1; mode=block"
        assert "strict-transport-security" in response.headers

    def test_request_logging(self, client: TestClient, caplog):
        """Test that requests are logged."""
        caplog.set_level("INFO")
        response = client.get("/api/v1/health/")
        assert response.status_code == 200

    def test_middleware_order(self, client: TestClient):
        """Test that all middlewares work together."""
        response = client.get("/")
        assert response.status_code == 200
        assert "x-process-time" in response.headers
        assert "x-content-type-options" in response.headers
