---
name: pre-commit-checklist
description: Ensures tests, linters, and documentation are verified before committing
---

## 1. Run All Tests

Run tests for BOTH backend and frontend and ensure they ALL pass:

Backend Tests:
- cd backend && source .venv/bin/activate && make test

Frontend Tests:
- cd frontend && nvm use && make test

## 2. Run All Linters

Run linters for BOTH backend and frontend and fix ANY issues:

Backend Linter:
- cd backend && source .venv/bin/activate && make lint

Frontend Linter:
- cd frontend && nvm use && make lint

## 3. Run Integration/E2E Tests (Optional but Recommended)

Run E2E tests if they exist. E2E tests use Playwright with Chromium (headless).

First, start the required servers:

Backend (port 8001):
```bash
cd backend
source .venv/bin/activate
CORS_ORIGINS='["http://localhost:5174"]' SECRET_KEY='test-secret-key' \
  python -m uvicorn app.main:app --port 8001 &
```

Frontend (port 5174):
```bash
cd frontend
npm run test:server &
```

Then run E2E tests:
```bash
cd frontend
nvm use
npm run test:e2e
```

Or use root Makefile (handles server startup):
```bash
make test-integration-install  # First time only
make test-integration
```

## 4. Verify Documentation

Per AGENTS.md Pre-Commit Requirements, update documentation if changes affect:
- README.md (root)
- backend/README.md
- frontend/README.md
- AGENTS.md (if process/tasks change)

## 5. Only Then Commit

After all tests pass, linters pass, and documentation is updated:
- git add -A && git commit -m "<message>"

## Important Notes
- This checklist MUST be followed for EVERY commit
- Do NOT skip any step
- If tests or linters fail, fix them before committing
- If documentation needs updating, update it before committing
