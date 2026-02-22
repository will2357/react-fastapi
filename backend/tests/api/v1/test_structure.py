"""Test directory structure is properly set up."""

import os


def test_directory_structure_exists():
    """Verify all required directories and files exist."""
    base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

    required_paths = [
        "app/__init__.py",
        "app/api/__init__.py",
        "app/api/deps.py",
        "app/api/v1/__init__.py",
        "app/api/v1/api.py",
        "app/api/v1/endpoints/__init__.py",
        "app/core/__init__.py",
        "app/core/config.py",
        "app/schemas/__init__.py",
        "app/schemas/item.py",
        "tests/__init__.py",
        "tests/conftest.py",
        "tests/api/__init__.py",
        "tests/api/v1/__init__.py",
    ]

    for path in required_paths:
        full_path = os.path.join(base_path, path)
        assert os.path.exists(full_path), f"Missing required file: {path}"


def test_imports_work():
    """Verify all modules can be imported."""
    from app.core.config import Settings, settings
    from app.schemas.item import ItemResponse

    # Verify Settings can be instantiated
    assert isinstance(settings, Settings)
    assert settings.API_V1_STR == "/api/v1"
    assert settings.PROJECT_NAME == "FastAPI Backend"

    # Verify schemas can be created
    item = ItemResponse(item_id=1, name="Test", price=10.0, q=None)
    assert item.item_id == 1
    assert item.name == "Test"
    assert item.price == 10.0
    assert item.q is None
