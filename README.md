# Vite + React + FastAPI Full-Stack App Template

A full-stack application template with a Vite/React frontend and FastAPI backend.

# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Template Placeholders

When using this as a GitHub template, replace these placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{PROJECT_NAME}}` | Project name (kebab-case) | `my-app` |
| `{{APP_NAME}}` | Display name | `My App` |
| `{{PROJECT_DESCRIPTION}}` | Project description | `A full-stack app with React and FastAPI` |
| `{{YOUR_DOMAIN}}` | Email domain | `example.com` |

### Files to Update

- `backend/app/core/config.py` - PROJECT_NAME, DATABASE_URL, SMTP settings
- `backend/app/main.py` - App title
- `backend/pyproject.toml` - Package name
- `backend/.env` / `.env.test` - Database URLs, project name
- `backend/alembic.ini` - Database URL
- `frontend/package.json` - Package name
- `frontend/index.html` - Page title

### Placeholder Feature Code

The following files contain example/placeholder code marked with `# TODO` comments:

- `backend/app/api/v1/endpoints/items.py` - Example CRUD endpoint
- `backend/app/models/item.py` - Example database model
- `backend/app/schemas/item.py` - Example Pydantic schemas
- `frontend/src/api/items.ts` - Example API client
- `frontend/src/pages/Dashboard.tsx` - Example UI
- `backend/alembic/versions/001_initial.py` - Example database table

## Prerequisites

- **uv** - for managing Python and dependencies
- **nvm** (Node Version Manager) - for managing Node.js

## Quick Start

### 1. Start the Backend

See [backend/README.md](./backend/README.md) for detailed instructions.

### 2. Start the Frontend

See [frontend/README.md](./frontend/README.md) for detailed instructions.

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
| POST | `/api/v1/auth/signup` | No | Register new user |
| GET | `/api/v1/auth/me` | Yes | Get current user |
| GET | `/api/v1/auth/confirm/{token}` | No | Confirm email |

> **Note:** The `/api/v1/items` endpoints are placeholder code marked with `# TODO` comments. Remove or replace with your own feature.

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

Copy `.env` to `.env.development` in backend directory:

```bash
cp backend/.env backend/.env.development
# Then edit backend/.env.development with your values
```

The template `.env` includes all available variables. Copy it to `.env.development` for development.

For testing, `.env.test` is already included in the repository.

### Frontend

Copy `.env` to `.env.development` in frontend directory:

```bash
cp frontend/.env frontend/.env.development
# Then edit frontend/.env.development with your values
```

The template `.env` includes all available variables. Copy it to `.env.development` for development.

For testing, `.env.test` is already included in the repository.
