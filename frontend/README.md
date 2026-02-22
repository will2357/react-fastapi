# {{APP_NAME}}

A React 19 frontend with Vite, TypeScript, Tailwind CSS, Axios, and Zustand.

## Prerequisites

- **nvm** (Node Version Manager) - for managing Node.js
- Node.js 24.13.1 (managed via `.nvmrc`)

## Quick Start

Create a `.env.development` file based upon the included `.env` template file.

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
make format       # Format code with Prettier
make format-check # Check code formatting
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
- **Prettier** - Code formatting

## Project Structure

```
src/
├── api/
│   ├── auth.ts        # Auth API (signup)
│   └── client.ts       # Axios client with auth interceptors
├── components/
│   └── ProtectedRoute.tsx  # Auth guard component
├── pages/
│   ├── Dashboard.tsx  # Protected dashboard page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   └── ConfirmSignup.tsx  # Email confirmation page
├── store/
│   └── useAuthStore.ts # Auth store (Zustand with persist)
├── App.tsx            # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Tailwind imports
tests/
├── setup.ts              # Test setup
├── App.test.tsx          # App tests
├── login.test.tsx        # Login page tests
├── signup.test.tsx       # Signup page tests
├── protectedRoute.test.tsx  # Protected route tests
├── store.test.ts        # Store tests (non-persist)
└── authStore.test.ts    # Auth store tests (with persistence)
```

## Authentication

The frontend includes JWT authentication with the backend:

- **Login Page** (`/login`) - User login form
- **Signup Page** (`/signup`) - User registration with email confirmation
- **Protected Routes** - Dashboard and other authenticated routes
- **Persistent State** - Auth state persisted via Zustand middleware
- **Auto-logout** - Redirects to login on 401 responses

### Auth Flow

1. User enters credentials on `/login` (or registers on `/signup`)
2. On signup, user receives confirmation email
3. User clicks confirmation link, redirected to login with success message
4. Frontend sends POST to `/api/v1/auth/login`
5. On success, token stored in localStorage via Zustand persist
6. Protected routes check auth state and hydration before rendering

### Avoiding Hydration Issues

The auth store uses `onRehydrateStorage` to track when persisted state is loaded:

- Protected routes show a loading spinner until `isHydrated` is true
- This prevents race conditions and infinite redirect loops

## Environment Variables

Copy `.env` to `.env.development` in frontend directory:

```bash
cp .env .env.development
# Then edit .env.development with your values
```

The template `.env` includes all available variables:
```bash
VITE_ENVIRONMENT="development"
VITE_FRONTEND_PORT=5173
VITE_BACKEND_PORT=8000
VITE_API_URL=http://localhost:8000
```

For testing, `.env.test` is already included in the repository.

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage
```
