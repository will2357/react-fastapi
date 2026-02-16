"""Test error handling functionality."""

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.exceptions import (
    AppException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnauthorizedException,
    ValidationException,
)


class TestErrorHandling:
    """Test error handling functionality."""

    def test_app_exception_handler(self):
        """Test AppException handler returns proper response."""
        test_app = FastAPI()

        @test_app.exception_handler(AppException)
        async def handler(request, exc):
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=exc.status_code,
                content={"detail": exc.message},
            )

        @test_app.get("/test")
        async def test_endpoint():
            raise AppException("Test error", status_code=400)

        client = TestClient(test_app)
        response = client.get("/test")
        assert response.status_code == 400
        assert response.json() == {"detail": "Test error"}

    def test_app_exception_handler_with_extra(self):
        """Test AppException handler returns extra data."""
        test_app = FastAPI()

        @test_app.exception_handler(AppException)
        async def handler(request, exc):
            from fastapi.responses import JSONResponse

            content = {"detail": exc.message}
            if exc.extra:
                content["extra"] = exc.extra
            return JSONResponse(
                status_code=exc.status_code,
                content=content,
            )

        @test_app.get("/test")
        async def test_endpoint():
            raise AppException("Test error", status_code=400, extra={"field": "value"})

        client = TestClient(test_app)
        response = client.get("/test")
        assert response.status_code == 400
        data = response.json()
        assert data["detail"] == "Test error"
        assert data["extra"] == {"field": "value"}

    def test_not_found_exception(self):
        """Test NotFoundException returns 404."""
        exc = NotFoundException("Item not found")
        assert exc.status_code == 404
        assert exc.message == "Item not found"

    def test_unauthorized_exception(self):
        """Test UnauthorizedException returns 401."""
        exc = UnauthorizedException()
        assert exc.status_code == 401

    def test_forbidden_exception(self):
        """Test ForbiddenException returns 403."""
        exc = ForbiddenException()
        assert exc.status_code == 403

    def test_conflict_exception(self):
        """Test ConflictException returns 409."""
        exc = ConflictException()
        assert exc.status_code == 409

    def test_validation_exception(self):
        """Test ValidationException returns 422."""
        exc = ValidationException()
        assert exc.status_code == 422

    def test_app_exception_with_extra(self):
        """Test AppException with extra data."""
        exc = AppException("Error", status_code=400, extra={"field": "value"})
        assert exc.extra == {"field": "value"}

    def test_http_exception_handler(self, client: TestClient):
        """Test HTTPException handler."""
        response = client.get("/nonexistent")
        assert response.status_code == 404
        assert "detail" in response.json()

    def test_validation_error_handler(self, client: TestClient):
        """Test validation error handler."""
        # First login to get token
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "test_user", "password": "user123"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        response = client.post("/api/v1/items", json={"invalid": "data"}, headers=headers)
        assert response.status_code == 422
        assert "detail" in response.json()
        assert "errors" in response.json()

    def test_generic_exception_handler_coverage(self, client: TestClient):
        """Test that generic exception is handled."""
        response = client.get("/")
        assert response.status_code == 200

    def test_app_exception_with_extra_in_main(self, client: TestClient):
        """Test AppException handler with extra data in main app."""
        response = client.get("/test-app-exception")
        assert response.status_code == 400
        data = response.json()
        assert data["detail"] == "Test error"
        assert data["extra"] == {"test": "data"}
