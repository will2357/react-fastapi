"""Test custom exception handling."""

from fastapi import FastAPI
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

    def test_app_exception_with_extra(self):
        """Test AppException with extra data."""
        exc = AppException("Test message", 400, extra={"key": "value"})
        assert exc.message == "Test message"
        assert exc.status_code == 400
        assert exc.extra == {"key": "value"}

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

    def test_custom_exception_handler(self):
        """Test that custom exceptions are handled properly."""
        test_app = FastAPI()

        @test_app.exception_handler(AppException)
        async def app_exception_handler(request, exc):
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=exc.status_code,
                content={"detail": exc.message},
            )

        @test_app.get("/test-error")
        async def trigger_error():
            raise NotFoundException("Custom not found")

        client = TestClient(test_app)
        response = client.get("/test-error")
        assert response.status_code == 404
        assert response.json() == {"detail": "Custom not found"}
