# FastAPI Backend

A production-ready FastAPI backend with JWT authentication, structured logging, modular structure, middleware, and comprehensive error handling.

## Quick Start

```bash
# Activate virtual environment
source .venv/bin/activate

# Run the server
python -m app.main

# Or use uvicorn directly
uvicorn app.main:app --reload
```

## Using Makefile

This project includes a Makefile for common development tasks:

```bash
make help      # Show available commands
make install   # Install dependencies
make dev       # Run development server
make test      # Run tests
make test-cov  # Run tests with coverage
make lint      # Run linter
make lint-fix  # Fix linting issues
make clean     # Clean cache files
```

## Running Tests

```bash
# Run all tests
python -m pytest -v

# Run with coverage
python -m pytest --cov=app tests/

# Or use Makefile
make test
make test-cov
```

## Linting

```bash
# Run ruff linter
ruff check .

# Fix auto-fixable issues
ruff check --fix .

# Or use Makefile
make lint
make lint-fix
```

## Middleware

The application includes several middleware components:

### Request Timing Middleware
- Adds `X-Process-Time` header to all responses
- Measures request processing time in seconds

### Request Logging Middleware
- Logs all incoming requests (method, path, client)
- Logs all completed requests (method, path, status code)

### Security Headers Middleware
- Adds security headers to all responses:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security`

### Correlation ID Middleware
- Adds unique correlation ID to each request for tracing
- Header: `X-Correlation-ID`

## Error Handling

The application includes comprehensive error handling:

### Custom Exceptions
- `AppException` - Base exception with custom status codes
- `NotFoundException` - 404 errors
- `ValidationException` - 422 validation errors
- `UnauthorizedException` - 401 authentication errors
- `ForbiddenException` - 403 permission errors
- `ConflictException` - 409 conflict errors

### Global Exception Handlers
- HTTPException handler for Starlette exceptions
- RequestValidationError handler for Pydantic validation errors
- Generic Exception handler with error IDs for unexpected errors

### Error Response Format
```json
{
  "detail": "Error message",
  "error_id": "unique-error-id",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Project Structure

```
app/
├── main.py           # Application entry point
├── api/
│   ├── deps.py      # Dependencies (auth, etc.)
│   └── v1/
│       ├── api.py   # Router aggregation
│       └── endpoints/
│           ├── auth.py    # Authentication (login)
│           ├── health.py  # Health check
│           └── items.py   # Items CRUD
├── core/
│   ├── config.py    # Settings (pydantic-settings)
│   ├── exceptions.py  # Custom exceptions
│   ├── logging.py   # Structlog configuration
│   ├── middleware.py  # Custom middleware
│   └── security.py  # JWT & password utilities
└── schemas/
    ├── auth.py      # Auth Pydantic models
    └── item.py      # Item Pydantic models
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Welcome message |
| GET | `/api/v1/health/` | No | Health check |
| POST | `/api/v1/auth/login` | No | Get JWT token |
| GET | `/api/v1/auth/me` | No | Get current user |
| GET | `/api/v1/items/{id}` | No | Get item |
| POST | `/api/v1/items` | No | Create item |
| GET | `/api/v1/items/protected-items` | Yes | Protected endpoint |

## Authentication

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d "username=admin&password=admin123"
```

### Access Protected Route
```bash
curl http://localhost:8000/api/v1/items/protected-items \
  -H "Authorization: Bearer <token>"
```

## Environment Variables

Create `.env` in backend directory:

```bash
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL="INFO"
LOG_JSON_FORMAT=false
SECRET_KEY="your-secret-key"
```

## Testing

The project includes comprehensive tests with 97% code coverage:
- Unit tests for utilities
- Integration tests for API endpoints
- Middleware tests
- Error handling tests
