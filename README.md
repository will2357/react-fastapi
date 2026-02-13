# Vite + React + FastAPI Full-Stack App

A full-stack application with a Vite/React frontend and FastAPI backend, using nvm for Node.js management and uv for Python management.

## Project Structure

```
.
├── Makefile                     # Root Makefile for full-stack commands
├── backend/                      # FastAPI Python backend
│   ├── app/                      # Application package
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI application entry point
│   │   ├── api/                 # API routes and dependencies
│   │   │   ├── __init__.py
│   │   │   ├── deps.py           # Dependency injection (auth, etc.)
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── api.py        # Router aggregation
│   │   │       └── endpoints/
│   │   │           ├── __init__.py
│   │   │           ├── auth.py   # Authentication endpoints
│   │   │           ├── health.py # Health check endpoint
│   │   │           └── items.py  # Items CRUD endpoints
│   │   ├── core/                 # Core utilities
│   │   │   ├── __init__.py
│   │   │   ├── config.py         # Settings (pydantic-settings)
│   │   │   ├── exceptions.py     # Custom exceptions
│   │   │   ├── logging.py        # Structlog configuration
│   │   │   └── security.py       # JWT & password utilities
│   │   └── schemas/              # Pydantic schemas
│   │       ├── __init__.py
│   │       ├── auth.py           # Auth schemas
│   │       └── item.py           # Item schemas
│   ├── tests/                    # Test suite
│   │   ├── __init__.py
│   │   ├── conftest.py          # Pytest fixtures
│   │   ├── test_auth.py         # Auth tests
│   │   ├── test_exceptions.py   # Exception tests
│   │   ├── test_logging.py      # Logging tests
│   │   └── api/
│   │       └── v1/
│   │           ├── test_health.py
│   │           ├── test_items.py
│   │           └── test_structure.py
│   ├── Makefile                 # Development tasks
│   ├── pyproject.toml           # Project dependencies
│   └── README.md                # Backend documentation
└── frontend/                    # Vite React frontend
    ├── src/                     # React source files
    ├── tests/                   # Test suite
    │   ├── setup.js            # Test setup
    │   └── App.test.jsx        # Component tests
    ├── Makefile                # Development tasks
    ├── package.json
    └── README.md               # Frontend documentation
```

## Prerequisites

- **nvm** (Node Version Manager) - for managing Node.js
- **uv** - for managing Python and dependencies

## Quick Start

### 1. Start the Backend

```bash
cd backend
source .venv/bin/activate
python -m app.main

# Or use Makefile
make dev
```

The backend will run on `http://localhost:8000`

### 2. Start the Frontend

In a new terminal:

```bash
# Make sure nvm is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the correct Node version
nvm use

cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Using Makefiles

### Backend Makefile

```bash
cd backend
make help      # Show available commands
make install   # Sync dependencies
make dev       # Run development server
make test      # Run tests
make test-cov  # Run tests with coverage
make lint      # Run linter
make clean     # Clean cache files
```

### Frontend Makefile

```bash
cd frontend
make help         # Show available commands
make install      # Install npm dependencies
make dev          # Run development server
make build        # Build for production
make test         # Run tests
make test-watch   # Run tests in watch mode
make test-cov     # Run tests with coverage
make lint         # Run ESLint
make clean        # Clean build artifacts
```

### Root Makefile

The root Makefile provides commands that work across both projects:

```bash
make help          # Show available commands
make install       # Install all dependencies
make install-be   # Install backend dependencies only
make install-fe   # Install frontend dependencies only
make dev          # Start both backend and frontend dev servers
make dev-be       # Start backend dev server only
make dev-fe       # Start frontend dev server only
make test         # Run all tests
make test-be      # Run backend tests only
make test-fe      # Run frontend tests only
make lint         # Run all linters
make lint-be      # Run backend linter (ruff)
make lint-fe      # Run frontend linter (ESLint)
make clean        # Clean all cache/build files
make stop         # Stop all running dev servers
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
python -m pytest -v

# Run with coverage
python -m pytest --cov=app tests/

# Or use Makefile
make test
make test-cov
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Or use Makefile
make test
make test-watch
make test-cov
```

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```bash
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL="INFO"
LOG_JSON_FORMAT=false
SECRET_KEY="your-secret-key-change-in-production"
```

### Frontend

Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_URL=http://localhost:8000
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint - returns welcome message |
| GET | `/api/v1/health/` | Health check endpoint |
| POST | `/api/v1/auth/login` | Login to get JWT token |

### Authenticated Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/items/protected-items` | Protected endpoint (requires JWT) |

### Items Endpoints (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/items/{item_id}` | Get item by ID |
| POST | `/api/v1/items` | Create a new item |

## Authentication

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d "username=admin&password=admin123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Access Protected Endpoint

```bash
curl -X GET http://localhost:8000/api/v1/items/protected-items \
  -H "Authorization: Bearer <your-access-token>"
```

### Mock Users

For development, the following mock users are available:

| Username | Password |
|----------|----------|
| admin | admin123 |
| user | user123 |

## Features

- **Vite** - Lightning fast frontend build tool
- **React 19** - Modern UI library with hooks
- **FastAPI** - High-performance Python web framework
- **Pydantic** - Data validation using Python type annotations
- **JWT Authentication** - Secure token-based auth with bcrypt password hashing
- **Structured Logging** - Using structlog with correlation IDs
- **Exception Handling** - Custom exception classes with global handlers
- **nvm** - Node version management
- **uv** - Ultra-fast Python package manager
- **Hot Reload** - Both frontend and backend support auto-reload during development
- **CORS** - Configured for local development
- **pytest** - Comprehensive backend testing
- **Vitest** - Fast frontend testing with React Testing Library

## License

MIT
