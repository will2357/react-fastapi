"""Test logging configuration."""



from app.core.logging import configure_logging, get_logger


class TestLogging:
    """Test structured logging configuration."""

    def test_configure_logging_json(self):
        """Test JSON logging configuration."""
        configure_logging(json_logs=True, log_level="INFO")
        logger = get_logger("test")
        # Just verify it doesn't raise an exception
        logger.info("test_message", key="value")

    def test_get_logger_returns_proxy(self):
        """Test that get_logger returns a structlog proxy (lazy)."""
        configure_logging(json_logs=False, log_level="INFO")
        logger = get_logger("test_module")
        # get_logger returns a BoundLoggerLazyProxy, not BoundLogger directly
        assert hasattr(logger, "bind")
        assert hasattr(logger, "info")

    def test_logger_has_context(self):
        """Test that logger can bind context."""
        configure_logging(json_logs=False, log_level="INFO")
        logger = get_logger("test")
        bound_logger = logger.bind(request_id="12345")
        assert bound_logger is not None
