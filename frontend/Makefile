.PHONY: help install dev build test test-cov test-e2e lint lint-fix format format-check clean run

help:
	@echo "Available commands:"
	@echo "  make install      - Install npm dependencies"
	@echo "  make dev         - Run development server"
	@echo "  make build       - Build for production"
	@echo "  make test        - Run unit tests"
	@echo "  make test-cov   - Run tests with coverage"
	@echo "  make test-e2e   - Run E2E integration tests"
	@echo "  make lint       - Run ESLint"
	@echo "  make lint-fix   - Fix ESLint issues"
	@echo "  make format      - Format code with Prettier"
	@echo "  make format-check - Check code formatting"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make run        - Run production server"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm test

test-cov:
	npm run test:coverage

test-e2e:
	npm run test:e2e

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

format-check:
	npm run format:check

clean:
	rm -rf dist coverage node_modules/.vite

run:
	npm run preview
