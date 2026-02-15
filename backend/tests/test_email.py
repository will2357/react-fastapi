"""Test email service."""

from unittest.mock import MagicMock, patch

from app.services.email import send_confirmation_email, send_email


class TestSendEmail:
    """Test send_email function."""

    def test_send_email_smtp_not_configured(self):
        """Test send_email when SMTP is not configured."""
        with patch("app.services.email.settings") as mock_settings:
            mock_settings.SMTP_USER = None
            mock_settings.SMTP_PASSWORD = None
            result = send_email("test@example.com", "Test Subject", "<p>Test</p>")
            assert result is False

    @patch("app.services.email.smtplib.SMTP")
    def test_send_email_success(self, mock_smtp):
        """Test send_email successful email sending."""
        with patch("app.services.email.settings") as mock_settings:
            mock_settings.SMTP_USER = "testuser"
            mock_settings.SMTP_PASSWORD = "testpass"
            mock_settings.SMTP_HOST = "smtp.example.com"
            mock_settings.SMTP_PORT = 587
            mock_settings.SMTP_FROM_NAME = "Test App"
            mock_settings.SMTP_FROM_EMAIL = "noreply@example.com"

            mock_server = MagicMock()
            mock_smtp.return_value.__enter__.return_value = mock_server

            result = send_email("test@example.com", "Test Subject", "<p>Test</p>")

            assert result is True
            mock_server.starttls.assert_called_once()
            mock_server.login.assert_called_once_with("testuser", "testpass")
            mock_server.send_message.assert_called_once()

    @patch("app.services.email.smtplib.SMTP")
    def test_send_email_failure(self, mock_smtp):
        """Test send_email when SMTP fails."""
        with patch("app.services.email.settings") as mock_settings:
            mock_settings.SMTP_USER = "testuser"
            mock_settings.SMTP_PASSWORD = "testpass"
            mock_settings.SMTP_HOST = "smtp.example.com"
            mock_settings.SMTP_PORT = 587
            mock_settings.SMTP_FROM_NAME = "Test App"
            mock_settings.SMTP_FROM_EMAIL = "noreply@example.com"

            mock_smtp.side_effect = Exception("SMTP connection failed")

            result = send_email("test@example.com", "Test Subject", "<p>Test</p>")

            assert result is False


class TestSendConfirmationEmail:
    """Test send_confirmation_email function."""

    @patch("app.services.email.send_email")
    def test_send_confirmation_email_success(self, mock_send_email):
        """Test send_confirmation_email successful email sending."""
        mock_send_email.return_value = True

        result = send_confirmation_email(
            "test@example.com", "testuser", "https://example.com/confirm"
        )

        assert result is True
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args
        assert call_args[0][0] == "test@example.com"
        assert call_args[0][1] == "Confirm your account"
        assert "testuser" in call_args[0][2]
        assert "https://example.com/confirm" in call_args[0][2]

    @patch("app.services.email.send_email")
    def test_send_confirmation_email_failure(self, mock_send_email):
        """Test send_confirmation_email when email sending fails."""
        mock_send_email.return_value = False

        result = send_confirmation_email(
            "test@example.com", "testuser", "https://example.com/confirm"
        )

        assert result is False
