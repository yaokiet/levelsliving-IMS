# api/v1/routes/test_route.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def test():
    """
    Test endpoint to check if the server is running.
    """
    return {"message": "Server is running!"}
