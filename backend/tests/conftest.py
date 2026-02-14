"""Pytest configuration and fixtures."""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

os.environ.setdefault("DATABASE_URL", "postgresql://test:password@localhost:5432/api_test")

from app.core.security import get_password_hash
from app.database import Base
from app.main import app
from app.models import Item, User

TEST_DATABASE_URL = "postgresql://test:password@localhost:5432/api_test"

engine = create_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Setup test database with DROP/CREATE for clean isolation."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function", autouse=True)
def seed_database():
    """Seed database with test data before each test, clean up after."""
    db = TestingSessionLocal()
    try:
        users = [
            User(
                username="test_admin",
                email="test_admin@example.com",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
            ),
            User(
                username="test_user",
                email="test_user@example.com",
                hashed_password=get_password_hash("user123"),
                is_active=True,
            ),
            User(
                username="e2e_user",
                email="e2e@example.com",
                hashed_password=get_password_hash("e2e123"),
                is_active=True,
            ),
        ]
        db.add_all(users)

        items = [
            Item(name="Test Item 1", price=10.00, description="First test item"),
            Item(name="Test Item 2", price=20.00, description="Second test item"),
        ]
        db.add_all(items)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    yield

    db = TestingSessionLocal()
    try:
        db.execute(text("TRUNCATE TABLE items, users RESTART IDENTITY CASCADE"))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def db_session():
    """Provide a database session for tests."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
