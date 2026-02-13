# Frontend

A React 19 frontend application built with Vite.

## Prerequisites

- **Node.js** 24.x (managed via nvm)
- **npm** (comes with Node.js)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will run on `http://localhost:5173`

## Using Makefile

This project includes a Makefile for common development tasks:

```bash
make help          # Show available commands
make install       # Install npm dependencies
make dev           # Run development server
make build         # Build for production
make preview       # Preview production build
make test          # Run tests
make test-watch    # Run tests in watch mode
make test-cov      # Run tests with coverage
make lint          # Run ESLint
make lint-fix      # Fix ESLint issues
make clean         # Clean build artifacts
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx         # Main App component
│   ├── App.css        # App styles
│   ├── main.jsx       # Entry point
│   ├── index.css      # Global styles
│   └── assets/        # Static assets
├── public/            # Public static files
├── tests/             # Test files
│   ├── setup.js       # Test setup
│   └── App.test.jsx  # App tests
├── index.html         # HTML entry point
├── package.json       # Dependencies
├── vite.config.js    # Vite configuration
├── eslint.config.js   # ESLint configuration
├── Makefile          # Development tasks
└── .nvmrc            # Node.js version
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:8000
```

Then use in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

## Features

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool with HMR
- **ESLint** - Code linting with React hooks rules
- **Vitest** - Fast unit testing with React Testing Library
- **StrictMode** - Enabled for development

## License

MIT
