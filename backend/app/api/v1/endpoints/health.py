"""Health check endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.database import get_db

router = APIRouter()
logger = get_logger(__name__)


@router.get("/")
async def health_check():
    """Basic health check (no DB)."""
    logger.debug("health_check_called")
    return {"status": "healthy"}


@router.get("/db")
def health_check_db(db: Session = Depends(get_db)):
    """Health check that verifies database connection."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error("database_health_check_failed", error=str(e))
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
