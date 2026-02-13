"""Item schemas."""

from pydantic import BaseModel, ConfigDict


class ItemBase(BaseModel):
    model_config = ConfigDict(strict=True)

    name: str
    price: float


class ItemCreate(ItemBase):
    pass


class ItemResponse(ItemBase):
    item_id: int
    q: str | None = None
