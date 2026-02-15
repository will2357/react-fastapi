"""Email service."""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Send an email via SMTP."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP not configured, skipping email",
            to=to_email,
            subject=subject,
        )
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = to_email

        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        logger.info("Email sent", to=to_email, subject=subject)
        return True
    except Exception as e:
        logger.error("Failed to send email", error=str(e), to=to_email)
        return False


def send_confirmation_email(to_email: str, username: str, confirmation_url: str) -> bool:
    """Send account confirmation email."""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome, {username}!</h2>
        <p>Thank you for signing up. Please confirm your account by clicking the button below:</p>
        <p>
            <a href="{confirmation_url}"
               style="background-color: #4CAF50; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 4px; display: inline-block;">
                Confirm Account
            </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">{confirmation_url}</p>
        <p>This link will expire in 24 hours.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">
            If you didn't create an account, please ignore this email.
        </p>
    </body>
    </html>
    """

    return send_email(to_email, "Confirm your account", html_content)
