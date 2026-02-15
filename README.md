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
make format       # Format code with Prettier
make format-check # Check code formatting
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

E2E tests use Playwright. The tests automatically start both backend (port 8001) and frontend (port 5174) servers.

```bash
# Run E2E tests
make test-integration

# Or use frontend Makefile
cd frontend
make test-e2e

# Or run directly
cd frontend
npm run test:e2e
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
npm run format
npm run format:check

# Or use Makefile
make lint
make lint-fix
make format
make format-check
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
    ├── tests/                   # Test suite
    ├── Makefile                # Development tasks
    ├── package.json
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
- Prettier

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

### Seeded Users

The dev and test databases are seeded with users via seed scripts:

| Username | Password | Description |
|----------|----------|-------------|
| admin | admin123 | Dev user (seed_dev.py) |
| user | user123 | Dev user (seed_dev.py) |
| e2e_user | e2e123 | Test user for E2E tests (seed_test.py) |

## Environment Variables

### Backend

Create `.env.dev` in backend directory (or copy from `.env.dev.example`):

```bash
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL="INFO"
LOG_JSON_FORMAT=false
SECRET_KEY="your-secret-key"
DATABASE_URL="postgresql://dev:argyle@localhost:5432/api_dev"
```

For testing, use `.env.test` with `CORS_ORIGINS=["http://localhost:5174"]` and `DATABASE_URL="postgresql://test:password@localhost:5432/api_test"`.

### Frontend

Create `.env.dev` in frontend directory:

```bash
VITE_API_URL=http://localhost:8000
```

For testing, create `.env.test` with `VITE_API_URL=http://localhost:8001`.
