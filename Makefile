.PHONY: help test-backend test-frontend test test-cov-backend test-cov-frontend test-cov lint-backend lint-frontend lint lint-fix-backend lint-fix-frontend lint-fix

SHELL = /bin/bash

help:
	@echo "Full-Stack App - Development Commands"
	@echo ""
	@echo "Testing:"
	@echo "  make test-backend       - Run backend tests (pytest)"
	@echo "  make test-frontend      - Run frontend tests (vitest)"
	@echo "  make test               - Run all tests"
	@echo "  make test-cov-backend   - Run backend tests with coverage"
	@echo "  make test-cov-frontend  - Run frontend tests with coverage"
	@echo "  make test-cov           - Run all tests with coverage"
	@echo ""
	@echo "Linting:"
	@echo "  make lint-backend        - Run backend linter (ruff)"
	@echo "  make lint-frontend       - Run frontend linter (ESLint)"
	@echo "  make lint                - Run all linters"
	@echo "  make lint-fix-backend    - Auto-fix backend lint issues"
	@echo "  make lint-fix-frontend   - Auto-fix frontend lint issues"
	@echo "  make lint-fix            - Auto-fix all lint issues"
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
