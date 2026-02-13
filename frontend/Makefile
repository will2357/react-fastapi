.PHONY: help install dev build test test-watch test-cov lint lint-fix clean

help:
	@echo "Available commands:"
	@echo "  make install      - Install npm dependencies"
	@echo "  make dev          - Run development server"
	@echo "  make build        - Build for production"
	@echo "  make test         - Run tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make test-cov     - Run tests with coverage"
	@echo "  make lint         - Run ESLint"
	@echo "  make lint-fix     - Fix ESLint issues"
	@echo "  make clean        - Clean build artifacts"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

clean:
	rm -rf dist coverage node_modules/.vite
