"""Tests for database connectivity and operations."""

# TODO: Replace with your own feature tests
# This file contains placeholder tests for the items table - remove or replace with your feature tests

from sqlalchemy import text


def test_database_connection(db_session):
    """Test that the database connection is working."""
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1


def test_users_table_exists(db_session):
    """Test that the users table exists."""
    result = db_session.execute(text("SELECT COUNT(*) FROM users"))
    count = result.scalar()
    assert count == 3


def test_items_table_exists(db_session):
    """Test that the items table exists."""
    result = db_session.execute(text("SELECT COUNT(*) FROM items"))
    count = result.scalar()
    assert count == 2


def test_user_data_seeded(db_session):
    """Test that users are properly seeded."""
    result = db_session.execute(
        text("SELECT username, email FROM users WHERE username = 'test_admin'")
    )
    user = result.fetchone()
    assert user is not None
    assert user[0] == "test_admin"
    assert user[1] == "test_admin@example.com"


def test_item_data_seeded(db_session):
    """Test that items are properly seeded."""
    result = db_session.execute(text("SELECT name, price FROM items"))
    items = result.fetchall()
    assert len(items) == 2
    assert items[0][0] == "Test Item 1"
    assert items[0][1] == 10.00


def test_database_is_postgresql(db_session):
    """Test that we're using PostgreSQL."""
    result = db_session.execute(text("SELECT version()"))
    version = result.scalar()
    assert "PostgreSQL" in version
