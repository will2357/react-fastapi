# AGENTS.md - Development Guidelines for AI Agents

This file provides development guidelines and commands for AI coding agents working in this repository.

---

## Project Overview

This is a full-stack application with:
- **Backend**: FastAPI (Python 3.14+) with JWT authentication
- **Frontend**: React 19 + Vite + TypeScript (via JSDoc)
- **Package Managers**: uv (backend), npm (frontend)

---

## Build, Lint, and Test Commands

### Backend Commands (Python)

```bash
cd backend
source .venv/bin/activate

# Install dependencies
uv sync

# Run development server
python -m app.main
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# or (using Makefile)
make dev

# Run all tests
python -m pytest -v

# Run a single test file
python -m pytest tests/test_auth.py -v

# Run a single test
python -m pytest tests/test_auth.py::TestPasswordHashing::test_password_hashing -v

# Run tests with coverage
python -m pytest --cov=app --cov-report=term-missing tests/

# Run linter (ruff)
ruff check .

# Auto-fix linting issues
ruff check --fix .

# Clean cache files
rm -rf .pytest_cache app/__pycache__ tests/__pycache__ .ruff_cache
# or (using Makefile)
make clean
```

### Frontend Commands (Node.js)

```bash
cd frontend

# Install dependencies
npm install
# or (using Makefile)
make install

# Run development server
npm run dev
# or (using Makefile)
make dev

# Build for production
npm run build

# Run tests
npm test
# or (using Makefile)
make test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a single test file
npm test -- tests/store.test.jsx

# Run ESLint
npm run lint
# or (using Makefile)
make lint

# Auto-fix ESLint issues
npm run lint -- --fix

# Clean build artifacts
rm -rf dist node_modules/.vite coverage
# or (using Makefile)
make clean
```

---

## Code Style Guidelines

### Python (Backend)

#### Imports
- Use absolute imports: `from app.core.config import settings`
- Group imports in this order: standard library, third-party, local application
- Use `isort` conventions (handled by ruff): standard library first, then third-party, then local

#### Formatting
- Maximum line length: 100 characters
- Use Black-compatible formatting (handled by ruff)
- Use double quotes for strings
- Use 4 spaces for indentation

#### Type Hints
- Use Python 3.14+ native type hints: `def func(x: int) -> str:`
- Use `|` instead of `Union` for type unions: `str | None` instead of `Optional[str]`
- Use `dict[str, Any]` instead of `Dict[str, Any]`

#### Naming Conventions
- Variables/functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private functions/variables: prefix with underscore `_private_func()`

#### Error Handling
- Use custom exceptions from `app/core/exceptions.py` when appropriate
- Always log errors with appropriate level (error for failures, warning for expected issues)
- Return structured error responses with error_id for unexpected errors

#### Docstrings
- Use Google-style docstrings for all public functions:
```python
def func(arg1: str, arg2: int) -> bool:
    """Short description.

    Args:
        arg1: Description of arg1.
        arg2: Description of arg2.

    Returns:
        Description of return value.

    Raises:
        ValueError: When arg2 is invalid.
    """
```

#### FastAPI Specific
- Use `async def` for all endpoint handlers
- Use Pydantic models for request/response validation (in `app/schemas/`)
- Use dependency injection with `Depends()` for cross-cutting concerns
- Return proper HTTP status codes (200 for OK, 201 for created, 401 for unauthorized, etc.)

#### Logging
- Use structlog: `logger = get_logger(__name__)`
- Use structured logging: `logger.info("event_name", key="value")`
- Include relevant context in log messages

---

### JavaScript/React (Frontend)

#### Imports
- Use absolute imports from src: `import { api } from '@/api/client'`
- Group imports: external libraries, internal components/hooks, styles

#### Formatting
- Maximum line length: 100 characters (ESLint will warn)
- Use ESLint + Prettier for formatting

#### Type Hints
- Use JSDoc comments for type hints since this is JavaScript
- Example: `/** @type {string} */`

#### Naming Conventions
- Components: `PascalCase` (e.g., `LoginForm.jsx`)
- Hooks: `camelCase` starting with `use` (e.g., `useAuthStore`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

#### React Best Practices
- Use functional components with hooks
- Keep components small and focused
- Use Zustand for global state management
- Use React Router for navigation
- Always handle loading and error states in async operations

#### Error Handling
- Use try/catch for async operations
- Display user-friendly error messages
- Log errors to console in development

#### Testing
- Use Vitest for testing
- Use React Testing Library for component testing
- Keep tests close to the code they test (e.g., `tests/components.test.jsx`)

---

## Project Structure

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── deps.py         # Dependencies (auth, etc.)
│   │   └── v1/
│   │       ├── api.py     # Router aggregation
│   │       └── endpoints/ # Feature-based endpoints
│   ├── core/
│   │   ├── config.py      # Settings (pydantic-settings)
│   │   ├── exceptions.py  # Custom exceptions
│   │   ├── logging.py    # Structlog setup
│   │   ├── middleware.py # Custom middleware
│   │   └── security.py   # JWT & password utilities
│   └── schemas/            # Pydantic models
├── tests/                  # Test files
├── Makefile
├── pyproject.toml
└── ruff.toml
```

### Frontend Structure

```
frontend/
├── src/
│   ├── api/              # Axios client
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   ├── store/           # Zustand stores
│   ├── App.jsx         # Main app with Router
│   └── main.jsx        # Entry point
├── tests/               # Test files
├── Makefile
├── package.json
└── vite.config.js
```

---

## Environment Variables

### Backend (.env)
```bash
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL="INFO"
LOG_JSON_FORMAT=false
SECRET_KEY="your-secret-key"
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
```

---

## Testing Requirements

- All new features should include tests
- Backend: Aim for >90% code coverage
- Frontend: Include unit tests for components and services
- Run tests before committing: `make test` (backend) / `npm test` (frontend)

---

## Git Conventions

- Use meaningful commit messages
- Commit frequently with logical changes
- Follow conventional commits format: `type(scope): description`

---

## Dependencies

### Backend
- fastapi, uvicorn - Web framework
- pydantic, pydantic-settings - Validation
- structlog - Structured logging
- pyjwt, bcrypt - Authentication
- pytest, pytest-cov - Testing
- ruff - Linting

### Frontend
- react, react-dom - UI framework
- react-router-dom - Routing
- zustand - State management
- axios - HTTP client
- vitest, @testing-library/react - Testing
- eslint - Linting
