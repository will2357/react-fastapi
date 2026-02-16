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
npm test                           # Run unit tests
npm run test:watch                 # Watch mode
npm run test:coverage              # With coverage

npm run lint                       # ESLint
npm run lint -- --fix              # Auto-fix
make test-cov                     # Run tests with coverage
make clean                         # Clean build artifacts

# E2E tests (vitest browser mode)
npm run test:e2e                   # Run E2E tests
make test-e2e                     # Or use Makefile
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
│   │       ├── api.py      # Router aggregation
│   │       └── endpoints/   # Feature endpoints
│   ├── core/
│   │   ├── config.py       # Settings
│   │   ├── exceptions.py   # Custom exceptions
│   │   ├── logging.py      # Structlog setup
│   │   ├── middleware.py   # Middleware
│   │   └── security.py     # JWT & password utils
│   └── schemas/            # Pydantic models
├── tests/                  # Test files
├── Makefile, pyproject.toml, ruff.toml

frontend/
├── src/
│   ├── api/              # Axios client
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── store/           # Zustand stores
│   ├── App.tsx          # Router
│   └── main.tsx         # Entry
├── tests/               # Test files (unit)
├── tests/e2e/           # E2E tests (vitest browser)
├── Makefile, package.json, vite.config.ts, vitest.config.ts
```

---

## Environment

**Backend (.env / .env.test)**:
- `.env` - Template included in repo (developer copies to `.env.local` for dev)
- `.env.test` - Already included in repo for testing

**Frontend (.env / .env.test)**:
- `.env` - Template included in repo (developer copies to `.env.local` for dev)
- `.env.test` - Already included in repo for testing

---

## Testing Requirements

- **All new features need tests**
- **All new features MUST include E2E tests** in `frontend/tests/e2e/`
- Backend: >90% coverage target
- Frontend: >90% coverage target
- Tests must pass before committing (see Pre-Commit Requirements)

### Test Naming Conventions

- Backend: `tests/test_<feature>.py` or `tests/api/v1/test_<feature>.py`
- Frontend unit: `tests/<feature>.test.ts` or `tests/<feature>.test.tsx`
- Frontend E2E: `tests/e2e/<feature>.test.ts`

---

## Pre-Commit Requirements

**ALWAYS follow these steps BEFORE creating a commit:**

### Step 1: Run All Tests

Run tests for BOTH backend and frontend and ensure they ALL pass:

- **Backend**: `cd backend && source .venv/bin/activate && make test`
- **Frontend**: `cd frontend && nvm use && make test`

### Step 2: Run All Linters

Run linters for BOTH backend and frontend and fix ANY issues:

- **Backend**: `cd backend && source .venv/bin/activate && make lint`
- **Frontend**: `cd frontend && nvm use && make lint`

### Step 3: Run E2E Tests (REQUIRED)

E2E tests are REQUIRED for all changes. E2E tests use Playwright:

- Run: `make test-integration`
- Or directly: `cd frontend && nvm use && npm run test:e2e`

### Step 4: Add E2E Tests for New Features (REQUIRED)

When adding new features, you MUST create E2E tests in `frontend/tests/e2e/`:

- Create new test file or add tests to existing test file
- Test the happy path and error cases
- Use Playwright with page locators

### Step 5: Update Documentation

Update documentation if changes affect:
- README.md (root)
- backend/README.md
- frontend/README.md
- AGENTS.md (if process/tasks change)

### Step 6: Commit

After all tests pass, linters pass, E2E tests pass, and documentation is updated:
- `git add -A && git commit -m "<message>"`

---

## Important Notes

- **This checklist MUST be followed for EVERY commit**
- **Do NOT skip any step**
- If tests or linters fail, fix them before committing
- If documentation needs updating, update it before committing
- E2E tests are REQUIRED - do not skip them

---

## Dependencies

- **Backend**: fastapi, uvicorn, pydantic, pydantic-settings, structlog, pyjwt, bcrypt, pytest, pytest-cov, ruff, sqlalchemy, alembic, psycopg2
- **Frontend**: react, react-dom, react-router-dom, zustand, axios, vitest, @testing-library/react, eslint, playwright, @vitest/browser

---

## Git

- Meaningful commit messages
- Follow conventional commits: `type(scope): description`

### Commit Message Examples

```
feat(auth): add password reset functionality
fix(items): correct trailing slash in API endpoint
test(items): add CRUD tests for items API
docs: update API documentation
refactor: simplify authentication flow
```

---

## Skills

### Pre-Commit Checklist Skill

The pre-commit-checklist skill can be invoked with `/` command, but all the rules are already in this AGENTS.md file. Always follow the Pre-Commit Requirements section above before committing.
