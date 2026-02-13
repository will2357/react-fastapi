# FastAPI Backend

A production-ready FastAPI backend with JWT authentication, structured logging, and modular structure.

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
make help    # Show available commands
make install # Install dependencies
make dev     # Run development server
make test    # Run tests
make lint    # Run linter
make clean   # Clean cache files
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

## Project Structure

```
app/
├── main.py           # Application entry point
├── api/
│   ├── deps.py       # Dependencies (auth, etc.)
│   └── v1/
│       ├── api.py    # Router aggregation
│       └── endpoints/
│           ├── auth.py    # Authentication (login)
│           ├── health.py  # Health check
│           └── items.py   # Items CRUD
├── core/
│   ├── config.py     # Settings (pydantic-settings)
│   ├── exceptions.py # Custom exceptions
│   ├── logging.py   # Structlog configuration
│   └── security.py  # JWT & password utilities
└── schemas/
    ├── auth.py       # Auth Pydantic models
    └── item.py      # Item Pydantic models
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Welcome message |
| GET | `/api/v1/health` | No | Health check |
| POST | `/api/v1/auth/login` | No | Get JWT token |
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
