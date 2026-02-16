.PHONY: help install dev build test test-cov lint lint-fix clean run

SHELL = /bin/bash

include .env.test
include .env.development

help:
	@echo "Available commands:"
	@echo "  make install    - Sync Python dependencies (uv sync)"
	@echo "  make dev        - Run development server (uvicorn with reload)"
	@echo "  make build      - Build for production (no-op for Python)"
	@echo "  make test       - Run all tests (uses DATABASE_URL from .env.test)"
	@echo "  make test-cov   - Run tests with coverage report"
	@echo "  make lint       - Run ruff linter"
	@echo "  make lint-fix   - Run ruff with auto-fix"
	@echo "  make clean      - Clean up cache files"
	@echo "  make run        - Run production server"

install:
	uv sync

dev:
	source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 \
		--port $(DEV_BACKEND_PORT)

build:
	@echo "No build step required for Python"

test:
	source .venv/bin/activate && DATABASE_URL=$(TEST_DATABASE_URL) \
		python -m pytest -v

test-cov:
	source .venv/bin/activate && DATABASE_URL=$(TEST_DATABASE_URL) \
		python -m pytest --cov=app --cov-report=term-missing tests/

lint:
	source .venv/bin/activate && ruff check .

lint-fix:
	source .venv/bin/activate && ruff check --fix .

clean:
	rm -rf .pytest_cache
	rm -rf __pycache__
	rm -rf app/__pycache__
	rm -rf app/*/__pycache__
	rm -rf app/*/*/__pycache__
	rm -rf tests/__pycache__
	rm -rf tests/*/__pycache__
	rm -rf .ruff_cache
	rm -rf htmlcov
	rm -rf .coverage

run:
	source .venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 \
		--port $(DEV_BACKEND_PORT)
