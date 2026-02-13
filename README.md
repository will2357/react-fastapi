# Vite + React + FastAPI Full-Stack App

A full-stack application with a Vite/React frontend and FastAPI backend, using nvm for Node.js management and uv for Python management.

## Project Structure

```
.
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
│   ├── .venv/                   # Python virtual environment (uv)
│   └── pyproject.toml           # Project dependencies
└── frontend/                    # Vite React frontend
    ├── src/                     # React source files
    ├── package.json
    └── ...
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

## Development

### Backend Development

The backend uses **uv** for Python package management:

```bash
cd backend

# Activate the virtual environment
source .venv/bin/activate

# Install additional packages
uv add <package-name>

# Run the development server with auto-reload
uvicorn app.main:app --reload
```

API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Testing

The backend includes tests using pytest:

```bash
cd backend

# Run all tests
python -m pytest -v

# Run a specific test file
python -m pytest tests/test_auth.py -v

# Run with coverage
python -m pytest --cov=app tests/
```

### Frontend Development

The frontend uses **nvm** for Node.js management and **npm** for packages:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the `backend/` directory to override default settings:

```bash
# Backend Settings
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"

# CORS
CORS_ORIGINS=["http://localhost:5173"]

# Logging
LOG_LEVEL="INFO"
LOG_JSON_FORMAT=false

# Security (JWT)
SECRET_KEY="your-secret-key-change-in-production"
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint - returns welcome message |
| GET | `/api/v1/health` | Health check endpoint |
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
# Login with username and password
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
# Use the access token to access protected endpoints
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
- **React** - Modern UI library with hooks
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

## License

MIT
