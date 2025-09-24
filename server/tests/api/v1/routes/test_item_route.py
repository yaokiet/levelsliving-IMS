import uuid 

BASE_PATH = "/levelsliving/app/api/v1/item"

# GET /
def test_read_items_ok(client, create_item):
    i1 = create_item(item_name="Item1", sku="ITEM1_123")
    i2 = create_item(item_name="Item2", sku="ITEM2_123")

    resp = client.get(f"{BASE_PATH}/")

    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert isinstance(data, list)
    names = {row.get("item_name") for row in data}
    assert "Item1" in names and "Item2" in names

# # GET /{item_id}
def test_read_item_ok(client, create_item):
    item = create_item(item_name="SingleItem", sku="SINGLE123")

    resp = client.get(f"{BASE_PATH}/{item.id}")

    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["id"] == item.id
    assert data["item_name"] == "SingleItem"
    assert data["sku"] == "SINGLE123"

def test_read_item_not_found(client):
    # read non existent item
    resp = client.get(f"{BASE_PATH}/999999")

    assert resp.status_code == 404
    assert resp.json()["detail"] == "Item not found"

# # POST /
def test_create_item_ok(client):
    payload = {
        "sku": "SKU12345",
        "type": "general",
        "item_name": "NewItem",
        "variant": "v1",
        "qty": 50,
        "threshold_qty": 10,
    }

    resp = client.post(f"{BASE_PATH}/", json=payload)

    assert resp.status_code == 200, resp.text
    data = resp.json()

    assert data["sku"] == "SKU12345"
    assert data["item_name"] == "NewItem"
    assert data["qty"] == 50
    assert data["threshold_qty"] == 10

# # PUT /{item_id}
def test_update_item_ok(client, create_item):
    item = create_item(item_name="OldName", sku="UPD123")

    payload = {
        "sku": "UPD123",
        "type": "general",
        "item_name": "NewName",
        "variant": "v2",
        "qty": 20,
        "threshold_qty": 5,
    }
    resp = client.put(f"{BASE_PATH}/{item.id}", json=payload)

    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["id"] == item.id
    assert data["item_name"] == "NewName"
    assert data["variant"] == "v2"
    assert data["qty"] == 20

def test_update_item_not_found(client):
    payload = {
        "sku": "NOPE123",
        "type": "general",
        "item_name": "GhostItem",
        "variant": None,
        "qty": 5,
        "threshold_qty": 1,
    }
    resp = client.put(f"{BASE_PATH}/999999", json=payload)

    assert resp.status_code == 404
    assert resp.json()["detail"] == "Item not found"

# # DELETE /{item_id}
def test_delete_item_ok(client, create_item):
    item = create_item(item_name="DeleteMe", sku="DEL123")

    resp = client.delete(f"{BASE_PATH}/{item.id}")

    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["id"] == item.id
    assert data["sku"] == "DEL123"

    # verify item is gone
    resp2 = client.get(f"{BASE_PATH}/{item.id}")
    assert resp2.status_code == 404

def test_delete_item_not_found(client):
    # delete something that doesn't exist
    resp = client.delete(f"{BASE_PATH}/999999")

    assert resp.status_code == 404
    assert resp.json()["detail"] == "Item not found"

# # GET /details/{item_id}
def test_get_item_details_ok(client, get_test_db):
    # Arrange: create parent, child, and link via ItemComponent
    from server.database.models.item import Item
    from server.database.models.item_component import ItemComponent

    parent = Item(
        sku=f"P-{uuid.uuid4().hex[:6]}",
        type="general",
        item_name="ParentItem",
        variant=None,
        qty=1,
        threshold_qty=1,
    )
    child = Item(
        sku=f"C-{uuid.uuid4().hex[:6]}",
        type="part",
        item_name="ChildItemA",
        variant="v1",
        qty=10,
        threshold_qty=2,
    )
    get_test_db.add_all([parent, child])
    get_test_db.commit()

    link = ItemComponent(parent_id=parent.id, child_id=child.id, qty_required=3)
    get_test_db.add(link)
    get_test_db.commit()

    # Act
    resp = client.get(f"{BASE_PATH}/details/{parent.id}")

    # Assert
    assert resp.status_code == 200, resp.text
    data = resp.json()

    # Parent fields (ItemWithComponents -> ItemRead)
    assert data["id"] == parent.id
    assert data["sku"] == parent.sku
    assert data["item_name"] == "ParentItem"
    assert isinstance(data.get("components"), list)

    # One component with ComponentDetail fields (includes qty_required)
    comp = data["components"][0]
    assert comp["id"] == child.id
    assert comp["sku"] == child.sku
    assert comp["item_name"] == "ChildItemA"
    assert comp["qty_required"] == 3
    # also ensure base Item fields present in ComponentDetail
    assert comp["type"] == "part"
    assert comp["threshold_qty"] == 2

def test_get_item_details_not_found(client):
    resp = client.get(f"{BASE_PATH}/details/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Item not found"

# # GET /lowest-children/{item_id}
# for my ref
#
#   PARENT
#     ├── A  (qty_required = 2)
#     │     └── C (qty_required = 4)   => C total = 2*4 = 8
#     └── B  (qty_required = 3)        => B total = 3
#
def test_lowest_children_ok(client, get_test_db):
    from server.database.models.item import Item
    from server.database.models.item_component import ItemComponent

    parent = Item(sku=f"P-{uuid.uuid4().hex[:6]}", type="general", item_name="Parent", variant=None, qty=1, threshold_qty=1)
    a      = Item(sku=f"A-{uuid.uuid4().hex[:6]}", type="part",    item_name="A",      variant=None, qty=1, threshold_qty=1)
    b      = Item(sku=f"B-{uuid.uuid4().hex[:6]}", type="part",    item_name="B",      variant=None, qty=1, threshold_qty=1)
    c      = Item(sku=f"C-{uuid.uuid4().hex[:6]}", type="part",    item_name="C",      variant=None, qty=1, threshold_qty=1)

    get_test_db.add_all([parent, a, b, c])
    get_test_db.commit()

    links = [
        ItemComponent(parent_id=parent.id, child_id=a.id, qty_required=2),
        ItemComponent(parent_id=parent.id, child_id=b.id, qty_required=3),
        ItemComponent(parent_id=a.id,      child_id=c.id, qty_required=4),
    ]
    get_test_db.add_all(links)
    get_test_db.commit()

    resp = client.get(f"{BASE_PATH}/lowest-children/{parent.id}")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert isinstance(data, list)

    # Build {id: total_qty_required} for assertion (order not guaranteed)
    totals = {row["id"]: row["total_qty_required"] for row in data}
    # Leaves should be B (3) and C (8)
    assert totals.get(b.id) == 3
    assert totals.get(c.id) == 8
    # No other leaves
    assert set(totals.keys()) == {b.id, c.id}

def test_lowest_children_not_found(client):
    resp = client.get(f"{BASE_PATH}/lowest-children/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Item not found"