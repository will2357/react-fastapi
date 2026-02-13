.PHONY: help test-backend test-frontend test test-cov-backend test-cov-frontend test-cov lint-backend lint-frontend lint lint-fix-backend lint-fix-frontend lint-fix test-integration test-integration-install

SHELL = /bin/bash

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
	@echo "  make test-integration   - Run E2E integration tests (vitest browser)"
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
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use && make test

test: test-backend test-frontend

test-cov-backend:
	cd backend && source .venv/bin/activate && make test-cov

test-cov-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use && make test-cov

test-cov: test-cov-backend test-cov-frontend

lint-backend:
	cd backend && source .venv/bin/activate && make lint

lint-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use && make lint

lint: lint-backend lint-frontend

lint-fix-backend:
	cd backend && source .venv/bin/activate && make lint-fix

lint-fix-frontend:
	cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use && make lint-fix

lint-fix: lint-fix-backend lint-fix-frontend

test-integration:
	@echo "Starting backend server..."
	@(cd backend && source .venv/bin/activate && CORS_ORIGINS='["http://localhost:5174"]' SECRET_KEY='test-secret-key' python -m uvicorn app.main:app --port 8001) &
	@sleep 3
	@echo "Starting frontend server..."
	@(cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use && VITE_API_URL='http://localhost:8001' npm run test:server) &
	@sleep 5
	@echo "Running E2E tests..."
	@cd frontend && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use && npm run test:e2e; EXIT_CODE=$$?; \
	pkill -f "uvicorn" 2>/dev/null || true; \
	pkill -f "vite" 2>/dev/null || true; \
	echo "Done."; \
	exit $$EXIT_CODE
