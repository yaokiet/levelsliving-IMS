import datetime as dt
import uuid
from decimal import Decimal

BASE_PATH = "/levelsliving/app/api/v1/order"

# Finish pagination route tests

# GET /{order_id}
def test_read_order_ok(client, create_order):
    from database.models import Order  # moved here (no top-level import)
    order = create_order(name="Bob Lee", status="processing")

    resp = client.get(f"{BASE_PATH}/{order.order_id}")

    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["order_id"] == order.order_id
    assert data["name"] == "Bob Lee"
    assert data["status"] == "processing"
    assert data["postal_code"] == "123456"


def test_read_order_not_found(client):
    resp = client.get(f"{BASE_PATH}/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Order not found"
    
# GET / {order_id}/with-items
def test_read_order_with_items_ok(client, get_test_db, create_order, create_item):
    from database.models import OrderItem

    order = create_order(name="Bob Lee", status="processing")
    i1 = create_item(sku=f"I-{uuid.uuid4().hex[:6]}", item_name="Item A")
    i2 = create_item(sku=f"I-{uuid.uuid4().hex[:6]}", item_name="Item B")

    oi1 = OrderItem(
        order_id=order.order_id, item_id=i1.id,
        qty_requested=2, value=Decimal("5.00"),
        delivery_date=dt.date.today(),
        delivered=False,
    )
    oi2 = OrderItem(
        order_id=order.order_id, item_id=i2.id,
        qty_requested=3, value=Decimal("7.50"),
        delivery_date=dt.date.today(),
        delivered=False,
    )
    
    get_test_db.add_all([oi1, oi2])
    get_test_db.commit()

    resp = client.get(f"{BASE_PATH}/{order.order_id}/with-items")
    assert resp.status_code == 200
    data = resp.json()
    assert data["order_qty"] == 5
    assert abs(float(data["total_value"]) - 32.5) < 1e-6
    
def test_read_order_with_items_not_found(client):
    resp = client.get(f"{BASE_PATH}/999999/with-items")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Order not found"
    
# PUT / {order_id}
def test_update_order_ok(client, create_order):
    o = create_order(name="Old Name", status="pending", contact="91234567")

    payload = {
        "name": "New Name",
        "contact": "97654321",
        "status": "processing",
        "street": "456 New St",
        "unit": "#02-02",
        "postal_code": "654321",
    }

    resp = client.put(f"{BASE_PATH}/{o.order_id}", json=payload)
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["order_id"] == o.order_id
    assert data["name"] == "New Name"
    assert data["contact"] == "97654321"
    assert data["status"] == "processing"
    assert data["street"] == "456 New St"
    assert data["unit"] == "#02-02"
    assert data["postal_code"] == "654321"


def test_update_order_not_found(client):
    payload = {
        "name": "Ghost",
        "contact": "90000000",
        "status": "processing",
        "street": "No St",
        "unit": None,
        "postal_code": "000000",
    }
    resp = client.put(f"{BASE_PATH}/999999", json=payload)
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Order not found"
    
# DELETE /{order_id}
def test_delete_order_ok(client, create_order):
    order = create_order(name="Delete Me", status="pending")

    resp = client.delete(f"{BASE_PATH}/{order.order_id}")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["order_id"] == order.order_id
    assert data["name"] == "Delete Me"

    check = client.get(f"{BASE_PATH}/{order.order_id}")
    assert check.status_code == 404

def test_delete_order_not_found(client):
    resp = client.delete(f"{BASE_PATH}/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Order not found"
