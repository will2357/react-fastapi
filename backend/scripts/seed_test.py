"""Seed the test database with test data for E2E tests."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.security import get_password_hash
from app.models import Item, User

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def seed_test():
    """Seed the test database."""
    db = SessionLocal()
    try:
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping seed.")
            return

        users = [
            User(
                username="e2e_user",
                email="e2e@example.com",
                hashed_password=get_password_hash("e2e123"),
                is_active=True,
            ),
        ]
        db.add_all(users)

        items = [
            Item(name="Test Item 1", price=10.00, description="Test item for E2E"),
            Item(name="Test Item 2", price=20.00, description="Another test item"),
        ]
        db.add_all(items)

        db.commit()
        print("Seeded test database successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_test()
