"""Seed the development database with initial data."""

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


def seed_dev():
    """Seed the development database."""
    db = SessionLocal()
    try:
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping seed.")
            return

        users = [
            User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
            ),
            User(
                username="user",
                email="user@example.com",
                hashed_password=get_password_hash("user123"),
                is_active=True,
            ),
        ]
        db.add_all(users)

        items = [
            Item(name="Laptop", price=999.99, description="High-performance laptop"),
            Item(name="Mouse", price=29.99, description="Wireless mouse"),
            Item(name="Keyboard", price=79.99, description="Mechanical keyboard"),
        ]
        db.add_all(items)

        db.commit()
        print("Seeded development database successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_dev()
