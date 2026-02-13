# Frontend

A React 19 frontend with Vite, TypeScript, Tailwind CSS, Axios, and Zustand.

## Prerequisites

- **nvm** (Node Version Manager) - for managing Node.js
- Node.js 24.13.1 (managed via `.nvmrc`)

## Quick Start

```bash
# Use the correct Node version
nvm use

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Using Makefile

```bash
make help         # Show available commands
make install      # Install npm dependencies
make dev          # Run development server
make build        # Build for production
make test         # Run tests
make test-watch   # Run tests in watch mode
make test-cov     # Run tests with coverage
make lint         # Run ESLint
make lint-fix     # Fix ESLint issues
make clean        # Clean build artifacts
```

## Tech Stack

- **Vite** - Build tool
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management
- **React Router** - Routing
- **Vitest** - Testing
- **ESLint** - Linting

## Project Structure

```
src/
├── api/
│   └── client.ts       # Axios client
├── store/
│   └── useAuthStore.ts # Auth store (Zustand)
├── App.tsx            # Main app component
├── main.tsx          # Entry point
└── index.css         # Tailwind imports
tests/
├── setup.ts          # Test setup
├── App.test.tsx      # App tests
└── store.test.ts    # Store tests
```

## Environment Variables

Create `.env` in frontend directory:

```bash
VITE_API_URL=http://localhost:8000
```
