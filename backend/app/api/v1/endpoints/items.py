"""Items endpoints."""

from fastapi import APIRouter, Depends

from app.api.deps import get_current_active_user
from app.core.logging import get_logger
from app.schemas.auth import User
from app.schemas.item import ItemCreate

router = APIRouter()
logger = get_logger(__name__)


@router.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    logger.info("read_item_called", item_id=item_id, query=q)
    return {"item_id": item_id, "q": q}


@router.post("/items")
async def create_item(item: ItemCreate):
    logger.info("create_item_called", item_name=item.name, item_price=item.price)
    return {"message": "Item created", "item": item}


@router.get("/protected-items")
async def read_protected_items(current_user: User = Depends(get_current_active_user)):
    """Example protected endpoint requiring authentication."""
    logger.info("protected_endpoint_accessed", username=current_user.username)
    return {
        "message": f"Hello {current_user.username}, you accessed a protected endpoint",
        "items": ["protected_item_1", "protected_item_2"],
    }
