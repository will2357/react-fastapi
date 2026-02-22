"""Item model."""

# TODO: Replace with your own model
# This is a placeholder database model - remove or replace with your model

from sqlalchemy import Column, Float, Integer, String

from app.models.base import Base


class Item(Base):
    """Item model."""

    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String(1000), nullable=True)
