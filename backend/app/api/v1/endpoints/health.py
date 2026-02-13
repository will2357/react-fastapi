"""Health check endpoint."""

from fastapi import APIRouter

from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.get("/")
async def health_check():
    logger.debug("health_check_called")
    return {"status": "healthy"}
