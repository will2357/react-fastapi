"""Custom exceptions for the application."""

from typing import Any


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str = "An error occurred",
        status_code: int = 500,
        extra: dict[str, Any] | None = None,
    ):
        self.message = message
        self.status_code = status_code
        self.extra = extra or {}
        super().__init__(self.message)


class NotFoundException(AppException):
    """Resource not found exception."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class ValidationException(AppException):
    """Validation error exception."""

    def __init__(self, message: str = "Validation error"):
        super().__init__(message=message, status_code=422)


class UnauthorizedException(AppException):
    """Unauthorized access exception."""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message=message, status_code=401)


class ForbiddenException(AppException):
    """Forbidden access exception."""

    def __init__(self, message: str = "Forbidden"):
        super().__init__(message=message, status_code=403)


class ConflictException(AppException):
    """Conflict exception."""

    def __init__(self, message: str = "Resource conflict"):
        super().__init__(message=message, status_code=409)
