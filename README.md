# Vite + React + FastAPI Full-Stack App

A full-stack application with a Vite/React frontend and FastAPI backend, using nvm for Node.js management and uv for Python management.

## Project Structure

```
.
├── backend/          # FastAPI Python backend
│   ├── .venv/       # Python virtual environment (created by uv)
│   ├── main.py      # FastAPI application entry point
│   └── pyproject.toml
└── frontend/         # Vite React frontend
    ├── src/         # React source files
    ├── package.json
    └── ...
```

## Prerequisites

- **nvm** (Node Version Manager) - for managing Node.js
- **uv** - for managing Python and dependencies

## Quick Start

### 1. Start the Backend

```bash
cd backend
source .venv/bin/activate
python main.py
```

The backend will run on `http://localhost:8000`

### 2. Start the Frontend

In a new terminal:

```bash
# Make sure nvm is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the correct Node version
nvm use

cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Development

### Backend Development

The backend uses **uv** for Python package management:

```bash
cd backend

# Activate the virtual environment
source .venv/bin/activate

# Install additional packages
uv add <package-name>

# Run the development server with auto-reload
uvicorn main:app --reload
```

API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Testing

The backend includes tests using pytest. Dev dependencies (including pytest) are automatically included when running with `uv`:

```bash
cd backend

# Run all tests (dev dependencies included automatically)
uv run pytest

# Run tests with verbose output
uv run pytest -v

# Run a specific test file
uv run pytest test_main.py
```

### Frontend Development

The frontend uses **nvm** for Node.js management and **npm** for packages:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints

- `GET /` - Returns a welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/items/{item_id}` - Get item by ID (optional query parameter `q`)
- `POST /api/items` - Create a new item

## Environment Management

### Node.js with nvm

The project includes a `.nvmrc` file specifying Node.js version 24.13.1:

```bash
# Install and use the correct Node version
nvm install
nvm use

# Check version
node --version  # v24.13.1
npm --version   # 11.8.0
```

### Python with uv

```bash
cd backend

# The virtual environment is already created at .venv/
# Activate it:
source .venv/bin/activate

# Sync dependencies from pyproject.toml
uv sync

# All packages are managed by uv automatically
```

## Features

- ⚡ **Vite** - Lightning fast frontend build tool
- ⚛️ **React** - Modern UI library with hooks
- 🐍 **FastAPI** - High-performance Python web framework
- 🔧 **nvm** - Node version management
- 🚀 **uv** - Ultra-fast Python package manager
- 🔄 **Hot Reload** - Both frontend and backend support auto-reload during development
- 🌐 **CORS** - Configured for local development
- 🧪 **pytest** - Backend testing with pytest and FastAPI TestClient

## License

MIT
