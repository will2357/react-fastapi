.PHONY: help install dev test test-cov lint lint-fix clean run

help:
	@echo "Available commands:"
	@echo "  make install    - Sync Python dependencies (uv sync)"
	@echo "  make dev        - Run development server (uvicorn with reload)"
	@echo "  make test       - Run all tests"
	@echo "  make test-cov   - Run tests with coverage report"
	@echo "  make lint       - Run ruff linter"
	@echo "  make lint-fix   - Run ruff with auto-fix"
	@echo "  make clean      - Clean up cache files"
	@echo "  make run        - Run production server"

install:
	uv sync

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	python -m pytest -v

test-cov:
	python -m pytest --cov=app --cov-report=term-missing tests/

lint:
	ruff check .

lint-fix:
	ruff check --fix .

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
	uvicorn app.main:app --host 0.0.0.0 --port 8000
