"""Items endpoints."""

# TODO: Replace with your own feature
# This is a placeholder CRUD endpoint - remove or replace with your feature

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


@router.get("/{item_id}")
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


@router.post("", response_model=ItemResponse)
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


@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    item: ItemCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    """Update an item."""
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db_item.name = item.name
    db_item.price = item.price
    db.commit()
    db.refresh(db_item)
    logger.info("item_updated", item_id=item_id, item_name=item.name)
    return ItemResponse(item_id=db_item.id, name=db_item.name, price=db_item.price)


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    """Delete an item."""
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.delete(db_item)
    db.commit()
    logger.info("item_deleted", item_id=item_id)
    return {"message": "Item deleted successfully"}


@router.get("")
def read_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    """Get all items for the authenticated user."""
    items = db.query(Item).all()
    logger.info("items_fetched", username=current_user.username, count=len(items))
    return [{"item_id": item.id, "name": item.name, "price": item.price} for item in items]
