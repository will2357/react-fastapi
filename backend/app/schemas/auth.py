"""Authentication schemas."""

from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    """Token response schema."""

    model_config = ConfigDict(strict=True)

    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Token payload schema."""

    model_config = ConfigDict(strict=True)

    sub: str | None = None


class UserLogin(BaseModel):
    """User login request schema."""

    model_config = ConfigDict(strict=True)

    username: str
    password: str


class User(BaseModel):
    """User schema."""

    model_config = ConfigDict(strict=True)

    username: str
    email: str | None = None
    is_active: bool = True


class UserInDB(User):
    """User with hashed password."""

    hashed_password: str


class UserSignup(BaseModel):
    """User signup request schema."""

    model_config = ConfigDict(strict=True)

    username: str
    email: str
    password: str


class SignupResponse(BaseModel):
    """Signup response schema."""

    model_config = ConfigDict(strict=True)

    message: str
