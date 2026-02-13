"""Items endpoints."""

from fastapi import APIRouter

from app.core.logging import get_logger
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
