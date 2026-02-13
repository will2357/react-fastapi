"""Middleware for the application."""

import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import get_logger

logger = get_logger(__name__)


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """Middleware to add X-Process-Time header to responses."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()

        response = await call_next(request)

        process_time = time.perf_counter() - start_time
        response.headers["X-Process-Time"] = str(process_time)

        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all incoming requests."""

    async def dispatch(self, request: Request, call_next):
        method = request.method
        path = request.url.path
        client_host = request.client.host if request.client else "unknown"

        logger.info(
            "request_started",
            method=method,
            path=path,
            client=client_host,
        )

        response = await call_next(request)

        logger.info(
            "request_completed",
            method=method,
            path=path,
            status_code=response.status_code,
        )

        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response
