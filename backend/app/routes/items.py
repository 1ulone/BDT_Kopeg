from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_items():
    return [
        {"id": 1, "name": "Item One"},
        {"id": 2, "name": "Item Two"},
    ]

@router.get("/{item_id}")
def get_item(item_id: int):
    return {"id": item_id, "name": f"Item {item_id}"}

