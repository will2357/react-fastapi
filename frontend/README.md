# Frontend

A React 19 frontend application integrated with FastAPI backend, built with Vite and TypeScript.

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

**Note:** Ensure the backend is running on `http://localhost:8000` for full functionality.

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
│   ├── api/
│   │   └── client.ts         # Axios client with interceptors
│   ├── components/
│   │   ├── LoginForm.tsx     # Login form component
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── ItemList.tsx      # Items display component
│   │   └── ProtectedRoute.tsx # Route guard component
│   ├── pages/
│   │   ├── Home.tsx         # Home page
│   │   ├── Login.tsx        # Login page
│   │   ├── Dashboard.tsx   # Protected dashboard
│   │   └── Items.tsx        # Items management
│   ├── services/
│   │   └── api.ts           # API service functions
│   ├── store/
│   │   └── useAuthStore.ts  # Zustand auth store
│   ├── App.tsx             # Main App with Router
│   ├── App.css             # App styles
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Public static files
├── tests/                   # Test files
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── Makefile                # Development tasks
└── .nvmrc                 # Node.js version
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
- **TypeScript** - Type-safe frontend code
- **React Router** - Client-side routing with protected routes
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Vite** - Fast build tool with HMR
- **ESLint** - Code linting with React hooks rules
- **Vitest** - Fast unit testing with React Testing Library
- **StrictMode** - Enabled for development

## Integration with Backend

The frontend integrates with the following backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | Login with username/password |
| `/api/v1/health/` | GET | Backend health check |
| `/api/v1/items/protected-items` | GET | Get protected items (requires JWT) |
| `/api/v1/items/items` | POST | Create new item (requires JWT) |

## Authentication Flow

1. User navigates to `/login`
2. User enters credentials
3. Frontend calls `/api/v1/auth/login`
4. Backend returns JWT token
5. Frontend stores token in localStorage via Zustand
6. Axios interceptor adds token to subsequent requests
7. Protected routes redirect to login if not authenticated

## Testing

The project includes comprehensive tests:

- **API Client** - Configuration tests
- **Auth Store** - State management tests
- **API Service** - API function tests
- **Components** - Component existence tests
- **Pages** - Page existence tests

Run tests with:
```bash
npm test
```

## License

MIT
