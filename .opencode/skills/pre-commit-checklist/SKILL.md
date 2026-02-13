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

## 3. Verify Documentation

Per AGENTS.md Pre-Commit Requirements, update documentation if changes affect:
- README.md (root)
- backend/README.md
- frontend/README.md
- AGENTS.md (if process/tasks change)

## 4. Only Then Commit

After all tests pass, linters pass, and documentation is updated:
- git add -A && git commit -m "<message>"

## Important Notes
- This checklist MUST be followed for EVERY commit
- Do NOT skip any step
- If tests or linters fail, fix them before committing
- If documentation needs updating, update it before committing
