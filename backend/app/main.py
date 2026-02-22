"""FastAPI application entry point with refactored structure."""

import uuid
from datetime import UTC, datetime

from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.core.logging import configure_logging, get_logger
from app.core.middleware import (
    RequestLoggingMiddleware,
    RequestTimingMiddleware,
    SecurityHeadersMiddleware,
)

# Configure logging at startup
configure_logging(
    json_logs=settings.LOG_JSON_FORMAT,
    log_level=settings.LOG_LEVEL,
)

logger = get_logger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Add middleware in order (CORS first, then others)
app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestTimingMiddleware)
app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions."""
    logger.error(
        "application_error",
        error_type=exc.__class__.__name__,
        message=exc.message,
        status_code=exc.status_code,
        path=request.url.path,
    )
    content = {"detail": exc.message}
    if exc.extra:
        content["extra"] = exc.extra
    return JSONResponse(
        status_code=exc.status_code,
        content=content,
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions."""
    logger.warning(
        "http_error",
        status_code=exc.status_code,
        detail=exc.detail,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    logger.warning(
        "validation_error",
        errors=exc.errors(),
        path=request.url.path,
    )
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    error_id = str(uuid.uuid4())
    logger.error(
        "unexpected_error",
        error_id=error_id,
        error_type=exc.__class__.__name__,
        str_error=str(exc),
        path=request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "error_id": error_id,
            "timestamp": datetime.now(UTC).isoformat(),
        },
    )


@app.get("/")
async def root():
    logger.info("root_endpoint_called", path="/")
    return {"message": "Hello from {{PROJECT_NAME}}!"}


@app.get("/test-app-exception")
async def test_app_exception():
    """Test endpoint that raises AppException with extra."""
    from app.core.exceptions import AppException

    raise AppException("Test error", status_code=400, extra={"test": "data"})


app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
