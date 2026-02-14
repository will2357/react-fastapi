"""Setup PostgreSQL users and databases for development and testing."""

import subprocess


def run_psql(command: str) -> None:
    """Run a psql command."""
    result = subprocess.run(
        ["psql", "-U", "postgres", "-h", "localhost", "-c", command],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 and "already exists" not in result.stderr:
        print(f"Error: {result.stderr}")
    else:
        print(f"Success: {result.stdout.strip()}")


def create_users():
    """Create dev and test users."""
    print("\n=== Creating users ===")
    run_psql("CREATE USER dev WITH PASSWORD 'argyle';")
    run_psql("CREATE USER test WITH PASSWORD 'password';")
    run_psql("ALTER USER dev CREATEDB;")
    run_psql("ALTER USER test CREATEDB;")


def create_databases():
    """Create api_dev and api_test databases."""
    print("\n=== Creating databases ===")
    run_psql("CREATE DATABASE api_dev OWNER dev;")
    run_psql("CREATE DATABASE api_test OWNER test;")


def grant_privileges():
    """Grant privileges to users."""
    print("\n=== Granting privileges ===")
    run_psql("GRANT ALL PRIVILEGES ON DATABASE api_dev TO dev;")
    run_psql("GRANT ALL PRIVILEGES ON DATABASE api_test TO test;")


def main():
    """Main setup function."""
    print("Setting up PostgreSQL users and databases...")
    create_users()
    create_databases()
    grant_privileges()
    print("\n=== Setup complete ===")
    print("Dev database: postgresql://dev:argyle@localhost:5432/api_dev")
    print("Test database: postgresql://test:password@localhost:5432/api_test")


if __name__ == "__main__":
    main()
