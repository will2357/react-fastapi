# AGENTS.md - Development Guidelines for AI Agents

Full-stack app: FastAPI backend (Python 3.14+) + React 19 frontend (Vite, TypeScript). Package managers: uv (backend), npm (frontend).

---

## Commands

### Backend
```bash
cd backend && source .venv/bin/activate

uv sync                              # Install deps
python -m app.main                   # Run dev server
make dev                             # Or use Makefile

python -m pytest -v                  # Run all tests
python -m pytest tests/test_auth.py -v           # Single test file
python -m pytest tests/test_auth.py::TestPasswordHashing::test_password_hashing -v  # Single test
python -m pytest --cov=app --cov-report=term-missing tests/  # With coverage

ruff check .                         # Lint
ruff check --fix .                   # Auto-fix
make test-cov                       # Run tests with coverage
make clean                           # Clean cache
```

### Frontend
```bash
# Source nvm (add to shell profile for persistence)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd frontend
nvm use                    # Use Node version from .nvmrc

npm install                # Install deps
npm run dev                         # Run dev server
make dev                            # Or use Makefile

npm run build                       # Production build
npm test                           # Run tests
npm run test:watch                 # Watch mode
npm run test:coverage              # With coverage

npm run lint                       # ESLint
npm run lint -- --fix              # Auto-fix
make test-cov                     # Run tests with coverage
make clean                         # Clean build artifacts
```

---

## Code Style

### Python (Backend)

- **Imports**: Absolute imports (`from app.core.config import settings`), grouped: stdlib, third-party, local
- **Formatting**: Max 100 chars, double quotes, 4 spaces, Black-compatible (via ruff)
- **Types**: Python 3.14+ native hints; use `|` not `Union`, `dict[str, Any]` not `Dict`
- **Naming**: `snake_case` (vars/funcs), `PascalCase` (classes), `UPPER_SNAKE_CASE` (constants), `_prefix` (private)
- **Error handling**: Use custom exceptions from `app/core/exceptions.py`, log appropriately, return structured errors
- **Docstrings**: Google-style for public functions
- **FastAPI**: `async def` for handlers, Pydantic in `app/schemas/`, `Depends()` for DI, proper HTTP codes
- **Logging**: Use structlog: `logger = get_logger(__name__)`, structured: `logger.info("event", key="value")`

### JavaScript/React (Frontend)

- **Imports**: Absolute from `@/` (e.g., `import { api } from '@/api/client'`), grouped: external, internal, styles
- **Formatting**: Max 100 chars, ESLint + Prettier
- **Types**: TypeScript (e.g., `const name: string`)
- **Naming**: `PascalCase` (components), `camelCase` (hooks with `use` prefix, functions/vars), `UPPER_SNAKE_CASE` (constants)
- **React**: Functional components with hooks, small focused components, Zustand for state, React Router, handle loading/error states
- **Error handling**: try/catch for async, user-friendly messages, console.log in dev

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI entry
│   ├── api/
│   │   ├── deps.py         # Dependencies (auth)
│   │   └── v1/
│   │       ├── api.py     # Router aggregation
│   │       └── endpoints/ # Feature endpoints
│   ├── core/
│   │   ├── config.py      # Settings
│   │   ├── exceptions.py  # Custom exceptions
│   │   ├── logging.py    # Structlog setup
│   │   ├── middleware.py # Middleware
│   │   └── security.py   # JWT & password utils
│   └── schemas/            # Pydantic models
├── tests/                  # Test files
├── Makefile, pyproject.toml, ruff.toml

frontend/
├── src/
│   ├── api/              # Axios client
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── store/           # Zustand stores
│   ├── App.tsx         # Router
│   └── main.tsx        # Entry
├── tests/               # Test files
├── Makefile, package.json, vite.config.ts
```

---

## Environment

**Backend (.env)**:
```
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL="INFO"
SECRET_KEY="your-secret-key"
```

**Frontend (.env)**: `VITE_API_URL=http://localhost:8000`

---

## Testing Requirements

- **All new features need tests**
- Backend: >90% coverage target
- Tests must pass before committing (see Pre-Commit Requirements)

---

## Pre-Commit Requirements

Before creating a commit:
1. **Run all tests and ensure they pass**:
   - Backend: `cd backend && make test`
   - Frontend: `cd frontend && nvm use && make test`
2. **Run linters and fix any issues**:
   - Backend: `cd backend && make lint`
   - Frontend: `cd frontend && nvm use && make lint`
3. **Update documentation** if the changes affect:
   - README.md (root)
   - backend/README.md
   - frontend/README.md
   - AGENTS.md (if process/tasks change)

---

## Dependencies

- **Backend**: fastapi, uvicorn, pydantic, pydantic-settings, structlog, pyjwt, bcrypt, pytest, pytest-cov, ruff
- **Frontend**: react, react-dom, react-router-dom, zustand, axios, vitest, @testing-library/react, eslint

---

## Git

- Meaningful commit messages
- Follow conventional commits: `type(scope): description`
