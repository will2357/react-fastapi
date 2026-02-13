# nvm setup
NVM_DIR := $(HOME)/.nvm
NVM_SH := $(NVM_DIR)/nvm.sh
NVMRC := $(CURDIR)/.nvmrc

define load_nvm
@if [ -f $(NVM_SH) ] && [ -f $(NVMRC) ]; then \
	. $(NVM_SH) && nvm use > /dev/null 2>&1; \
fi
endef

.PHONY: help install dev build preview test test-watch test-cov lint lint-fix clean

help:
	@echo "Available commands:"
	@echo "  make install      - Install npm dependencies"
	@echo "  make dev          - Run Vite development server"
	@echo "  make build        - Build for production"
	@echo "  make preview      - Preview production build"
	@echo "  make test         - Run tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make test-cov     - Run tests with coverage"
	@echo "  make lint         - Run ESLint"
	@echo "  make lint-fix     - Fix ESLint issues"
	@echo "  make clean        - Clean build artifacts"
	@echo ""
	@echo "Note: Run 'source ~/.nvm/nvm.sh && nvm use' before using npm directly"

install:
	$(load_nvm)
	npm install

dev:
	$(load_nvm)
	npm run dev

build:
	$(load_nvm)
	npm run build

preview:
	$(load_nvm)
	npm run preview

test:
	$(load_nvm)
	npm test

test-watch:
	$(load_nvm)
	npm run test:watch

test-cov:
	$(load_nvm)
	npm run test:coverage

lint:
	$(load_nvm)
	npm run lint

lint-fix:
	$(load_nvm)
	npm run lint -- --fix

clean:
	rm -rf dist
	rm -rf node_modules/.vite
	rm -rf coverage
