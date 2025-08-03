from .routes.item_route import router as item_router
from .routes.user_route import router as user_router
from .routes.supplier_route import router as supplier_router
from .routes.auth_route import router as auth_router

from fastapi import APIRouter

router = APIRouter(prefix="/levelsliving/app/api/v1")
router.include_router(user_router)
router.include_router(item_router)
router.include_router(supplier_router)
router.include_router(auth_router)

@router.get("/test")
def test():
    """
    Test endpoint to check if the server is running.
    """
    return {"message": "Server is running!"}
