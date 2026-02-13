# Vite + React + FastAPI Full-Stack App

A full-stack application with a Vite/React frontend and FastAPI backend.

## Prerequisites

- **uv** - for managing Python and dependencies
- **nvm** (Node Version Manager) - for managing Node.js

## Quick Start

### 1. Start the Backend

```bash
cd backend

# Activate virtual environment
source .venv/bin/activate

# Run the server
python -m app.main

# Or use Makefile
make dev
```

The backend will run on `http://localhost:8000`

### 2. Start the Frontend

In a new terminal:

```bash
# Use the correct Node version
nvm use

cd frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Using Makefiles

### Backend Makefile

```bash
cd backend

make help      # Show available commands
make install   # Install dependencies
make dev       # Run development server
make test      # Run tests
make test-cov  # Run tests with coverage
make lint      # Run linter
make lint-fix  # Fix linting issues
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
make lint-fix     # Fix ESLint issues
make clean        # Clean build artifacts
```

## Running Tests

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

### Integration/E2E Tests

E2E tests use Playwright with Chromium (headless). The tests automatically start both backend (port 8001) and frontend (port 5174) servers.

```bash
# Install Playwright browsers (one time only)
make test-integration-install

# Run E2E tests (requires manual server startup first)
# First, start backend on port 8001:
cd backend
source .venv/bin/activate
CORS_ORIGINS='["http://localhost:5174"]' SECRET_KEY='test-secret-key' \
  python -m uvicorn app.main:app --port 8001 &

# In another terminal, start frontend on port 5174:
cd frontend
npm run test:server &

# Then run E2E tests:
cd frontend
npm run test:e2e

# Or use root Makefile (handles server startup):
make test-integration
```

## Linting

### Backend

```bash
cd backend

ruff check .
ruff check --fix .

# Or use Makefile
make lint
make lint-fix
```

### Frontend

```bash
cd frontend

npm run lint
npm run lint:fix

# Or use Makefile
make lint
make lint-fix
```

## Project Structure

```
.
├── backend/                      # FastAPI Python backend
│   ├── app/                      # Application package
│   │   ├── main.py               # FastAPI application entry point
│   │   ├── api/                 # API routes and dependencies
│   │   ├── core/                 # Core utilities
│   │   └── schemas/              # Pydantic schemas
│   ├── tests/                    # Test suite
│   ├── Makefile                 # Development tasks
│   └── pyproject.toml           # Project dependencies
└── frontend/                    # Vite React frontend
    ├── src/                     # React source files
    │   ├── api/                # Axios client
    │   ├── store/              # Zustand stores
    │   ├── App.tsx             # Main app component
    │   └── main.tsx            # Entry point
    ├── tests/                   # Test suite (unit)
    ├── tests/e2e/               # E2E tests (Playwright)
    ├── Makefile                # Development tasks
    ├── package.json
    ├── vitest.config.mts       # Vitest config
    └── README.md               # Frontend documentation
```

## Tech Stack

### Backend
- FastAPI
- Pydantic
- Structlog
- JWT + bcrypt
- pytest

### Frontend
- Vite
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Zustand
- React Router
- Vitest
- ESLint

## API Endpoints

### Backend

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

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Mock Users

| Username | Password |
|----------|----------|
| admin | admin123 |
| user | user123 |

## Environment Variables

### Backend

Create `.env` in backend directory:

```bash
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL="INFO"
LOG_JSON_FORMAT=false
SECRET_KEY="your-secret-key"
```

### Frontend

Create `.env` in frontend directory:

```bash
VITE_API_URL=http://localhost:8000
```
