from starlette.middleware.base import BaseHTTPMiddleware
from server.app.core.config import SECRET_KEY, ALGORITHM
from fastapi.responses import JSONResponse
from fastapi import Request
from jose import jwt, JWTError

# Paths that do not require authentication
EXEMPT_PATHS = [
    "/levelsliving/app/api/v1/login",
    "/levelsliving/app/api/v1/refresh",
    "/levelsliving/app/api/v1/logout",
    "/docs",
    "/openapi.json",
    "/redoc"
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow exempt paths
        if any(request.url.path.startswith(path) for path in EXEMPT_PATHS):
            return await call_next(request)

        access_token = request.cookies.get("access_token")
        if not access_token:
            return JSONResponse({"detail": "Not authenticated"}, status_code=401)

        try:
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = payload  # You can access user info in endpoints via request.state.user
        except JWTError:
            return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)

        return await call_next(request)