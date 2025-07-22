
from .routes.test_route import router as test_router
from .routes.items import router as items_router
from .routes.user_route import router as user_router
from fastapi import APIRouter

router = APIRouter(prefix="/levelsliving/app/api/v1")
router.include_router(test_router)
router.include_router(items_router)

router.include_router(user_router)

@router.get("/test")
def test():
    """
    Test endpoint to check if the server is running.
    """
    return {"message": "Server is running!"}

