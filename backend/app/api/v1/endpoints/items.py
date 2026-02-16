"""Items endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.endpoints.auth import get_current_active_user
from app.core.logging import get_logger
from app.database import get_db
from app.models import Item, User
from app.schemas.item import ItemCreate, ItemResponse

router = APIRouter()
logger = get_logger(__name__)


@router.get("/items/{item_id}")
def read_item(
    item_id: int,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    """Read an item by ID."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return {"item_id": item.id, "name": item.name, "price": item.price}


@router.post("/items", response_model=ItemResponse)
def create_item(
    item: ItemCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    """Create a new item."""
    db_item = Item(name=item.name, price=item.price)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    logger.info("create_item_called", item_name=item.name, item_price=item.price)
    return ItemResponse(item_id=db_item.id, name=db_item.name, price=db_item.price)


@router.get("/protected-items")
def read_protected_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    """Example protected endpoint requiring authentication."""
    items = db.query(Item).all()
    logger.info("protected_endpoint_accessed", username=current_user.username)
    return {
        "message": f"Hello {current_user.username}, you accessed a protected endpoint",
        "items": [{"id": item.id, "name": item.name, "price": item.price} for item in items],
    }
