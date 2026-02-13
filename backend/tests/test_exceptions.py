"""Test custom exception handling."""

import pytest
from fastapi.testclient import TestClient

from app.core.exceptions import (
    AppException,
    NotFoundException,
    UnauthorizedException,
    ValidationException,
)


class TestExceptions:
    """Test custom exceptions and handlers."""

    def test_app_exception_attributes(self):
        """Test AppException has correct attributes."""
        exc = AppException("Test message", 400)
        assert exc.message == "Test message"
        assert exc.status_code == 400

    def test_not_found_exception(self):
        """Test NotFoundException defaults."""
        exc = NotFoundException()
        assert exc.message == "Resource not found"
        assert exc.status_code == 404

    def test_validation_exception(self):
        """Test ValidationException defaults."""
        exc = ValidationException()
        assert exc.message == "Validation error"
        assert exc.status_code == 422

    def test_unauthorized_exception(self):
        """Test UnauthorizedException defaults."""
        exc = UnauthorizedException()
        assert exc.message == "Unauthorized"
        assert exc.status_code == 401

    def test_custom_exception_handler(self, client: TestClient):
        """Test that custom exceptions are handled properly."""
        from app.main import app

        @app.get("/test-error")
        async def trigger_error():
            raise NotFoundException("Custom not found")

        response = client.get("/test-error")
        assert response.status_code == 404
        assert response.json() == {"detail": "Custom not found"}
