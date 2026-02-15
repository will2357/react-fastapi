.PHONY: help test-backend test-frontend test test-cov-backend test-cov-frontend test-cov lint-backend lint-frontend lint lint-fix-backend lint-fix-frontend lint-fix test-integration test-integration-install

SHELL = /bin/bash

include ./frontend/.env.test
include ./backend/.env.test

help:
	@echo "Full-Stack App - Development Commands"
	@echo ""
	@echo "Testing:"
	@echo "  make test-backend        - Run backend tests (pytest)"
	@echo "  make test-frontend       - Run frontend tests (vitest)"
	@echo "  make test               - Run all tests"
	@echo "  make test-cov-backend   - Run backend tests with coverage"
	@echo "  make test-cov-frontend  - Run frontend tests with coverage"
	@echo "  make test-cov           - Run all tests with coverage"
	@echo "  make test-integration   - Run E2E integration tests (Playwright)"
	@echo ""
	@echo "Linting:"
	@echo "  make lint-backend       - Run backend linter (ruff)"
	@echo "  make lint-frontend      - Run frontend linter (ESLint)"
	@echo "  make lint               - Run all linters"
	@echo "  make lint-fix-backend   - Auto-fix backend lint issues"
	@echo "  make lint-fix-frontend  - Auto-fix frontend lint issues"
	@echo "  make lint-fix           - Auto-fix all lint issues"
	@echo ""
	@echo "Note: Backend uses uv for Python package management."

test-backend:
	cd backend && source .venv/bin/activate && make test

test-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \
		. "$$NVM_DIR/nvm.sh" && nvm use && make test

test: test-backend test-frontend

test-cov-backend:
	cd backend && source .venv/bin/activate && make test-cov

test-cov-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \
		. "$$NVM_DIR/nvm.sh" && nvm use && make test-cov

test-cov: test-cov-backend test-cov-frontend

lint-backend:
	cd backend && source .venv/bin/activate && make lint

lint-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \
		. "$$NVM_DIR/nvm.sh" && nvm use && make lint

lint: lint-backend lint-frontend

lint-fix-backend:
	cd backend && source .venv/bin/activate && make lint-fix

lint-fix-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \
		. "$$NVM_DIR/nvm.sh" && nvm use && make lint-fix

lint-fix: lint-fix-backend lint-fix-frontend

test-integration:
	echo "DB URL $(TEST_DATABASE_URL)"
	@echo "Resetting database for integration tests..."
	@echo "Running database migrations for test..."
	@psql $(TEST_DATABASE_URL) -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	@cd backend && source .venv/bin/activate && DATABASE_URL=$(TEST_DATABASE_URL) \
		alembic upgrade head
	@echo "Seeding test database..."
	@cd backend && source .venv/bin/activate && DATABASE_URL=$(TEST_DATABASE_URL) \
		python scripts/seed_test.py
	@echo "Starting backend server..."
	@(cd backend && source .venv/bin/activate && CORS_ORIGINS='$(CORS_ORIGINS)' \
		SECRET_KEY=$(TEST_SECRET_KEY) DATABASE_URL=$(TEST_DATABASE_URL) \
		python -m uvicorn app.main:app --port $(TEST_BACKEND_PORT)) &
	@sleep 3
	@echo "Starting frontend server..."
	@(cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \
		. "$$NVM_DIR/nvm.sh" && nvm use && VITE_API_URL=$(VITE_API_URL) \
		npm run test:server) &
	@sleep 5
	@echo "Running E2E tests..."
	@cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \
		. "$$NVM_DIR/nvm.sh" && nvm use && npm run test:e2e; TEST_EXIT=$$?; \
		kill $$(lsof -t -i:$(TEST_BACKEND_PORT)) 2>/dev/null || true; \
		kill $$(lsof -t -i:$(VITE_FRONTEND_PORT)) 2>/dev/null || true; \
		echo "Cleanup complete."; \
		exit $$TEST_EXIT
	@sleep 1
	@echo

test-all: test-backend test-frontend test-integration
