from server.api.v1.routes.item_route import router as item_router
from server.api.v1.routes.user_route import router as user_router
from server.api.v1.routes.supplier_route import router as supplier_router
from server.api.v1.routes.supplier_item_route import router as supplier_item_router
from server.api.v1.routes.item_component_route import router as item_component_router
from server.api.v1.routes.purchase_order_route import router as purchase_order_router
from server.api.v1.routes.purchase_order_item_route import router as purchase_order_item_router
from server.api.v1.routes.order_route import router as order_router
from server.api.v1.routes.order_item_route import router as order_item_router
from server.api.v1.routes.auth_route import router as auth_router
from server.api.v1.routes.lark_route import router as lark_router
from server.api.v1.routes.cart_route import router as cart_router

from fastapi import APIRouter

router = APIRouter(prefix="/levelsliving/app/api/v1")
router.include_router(user_router)
router.include_router(item_router)
router.include_router(supplier_router)
router.include_router(supplier_item_router)
router.include_router(item_component_router)
router.include_router(purchase_order_router)
router.include_router(purchase_order_item_router)
router.include_router(order_router)
router.include_router(order_item_router)
router.include_router(auth_router)
router.include_router(lark_router)
router.include_router(cart_router)


@router.get("/test")
def test():
    """
    Test endpoint to check if the server is running.
    """
    return {"message": "Server is running!"}
