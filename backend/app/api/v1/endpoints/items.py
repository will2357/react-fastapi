"""Items endpoints."""

from fastapi import APIRouter

from app.schemas.item import ItemCreate

router = APIRouter()


@router.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@router.post("/items")
async def create_item(item: ItemCreate):
    return {"message": "Item created", "item": item}
