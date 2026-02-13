.PHONY: help install install-be install-fe dev dev-be dev-fe test test-be test-fe lint lint-be lint-fe clean stop

help:
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies (backend + frontend)"
	@echo "  make install-be  - Install backend dependencies only"
	@echo "  make install-fe  - Install frontend dependencies only"
	@echo "  make dev         - Start both backend and frontend dev servers"
	@echo "  make dev-be      - Start backend dev server only"
	@echo "  make dev-fe      - Start frontend dev server only"
	@echo "  make test        - Run all tests"
	@echo "  make test-be     - Run backend tests only"
	@echo "  make test-fe     - Run frontend tests only"
	@echo "  make lint        - Run all linters"
	@echo "  make lint-be     - Run backend linter (ruff)"
	@echo "  make lint-fe     - Run frontend linter (ESLint)"
	@echo "  make clean       - Clean all cache/build files"
	@echo "  make stop        - Stop running dev servers"

install: install-be install-fe

install-be:
	cd backend && uv sync

install-fe:
	cd frontend && npm install

dev: dev-be dev-fe
	@echo ""
	@echo "Backend running on http://localhost:8000"
	@echo "Frontend running on http://localhost:5173"
	@echo "Press Ctrl+C to stop all servers"

dev-be:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

dev-fe:
	cd frontend && npm run dev &

test: test-be test-fe

test-be:
	cd backend && python -m pytest -v

test-fe:
	cd frontend && npm test

lint: lint-be lint-fe

lint-be:
	cd backend && ruff check .

lint-fe:
	cd frontend && npm run lint

clean:
	cd backend && make clean
	cd frontend && make clean

stop:
	-pkill -f "uvicorn app.main:app" || true
	-pkill -f "vite" || true
	@echo "Stopped all dev servers"
