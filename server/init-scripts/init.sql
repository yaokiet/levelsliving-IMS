-- =======================
-- USERS
-- =======================
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user')) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- =======================
-- SUPPLIERS
-- =======================
CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(64),
    email VARCHAR(254),
    contact_number VARCHAR(20)
);

-- =======================
-- ITEMS
-- =======================
CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(32) UNIQUE NOT NULL,
    type VARCHAR(32) NOT NULL,
    item_name VARCHAR(64) NOT NULL,
    variant VARCHAR(64),
    qty INT NOT NULL,
    threshold_qty INT NOT NULL
);

-- =======================
-- SUPPLIER_ITEM
-- =======================
CREATE TABLE supplier_item (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES item(id) ON DELETE CASCADE NOT NULL,
    supplier_id INT REFERENCES supplier(id) ON DELETE CASCADE NOT NULL,
    UNIQUE (item_id, supplier_id)
);

-- =======================
-- ITEM_COMPONENT (Bill of Materials)
-- =======================
CREATE TABLE item_component (
    parent_id INT REFERENCES item(id) ON DELETE CASCADE NOT NULL,
    child_id INT REFERENCES item(id) ON DELETE CASCADE NOT NULL,
    qty_required INT NOT NULL,
    PRIMARY KEY (parent_id, child_id)
);

-- =======================
-- PURCHASE ORDER
-- =======================
CREATE TABLE purchase_order (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES supplier(id) ON DELETE SET NULL,
    user_id INT REFERENCES "user"(id) ON DELETE SET NULL,
    order_date TIMESTAMP NOT NULL
);

-- =======================
-- PURCHASE ORDER ITEM
-- =======================
CREATE TABLE purchase_order_item (
    purchase_order_id INT REFERENCES purchase_order(id) ON DELETE CASCADE NOT NULL,
    item_id INT REFERENCES item(id) ON DELETE CASCADE NOT NULL,
    qty INT NOT NULL,
    supplier_item_id INT REFERENCES supplier_item(id) ON DELETE SET NULL,
    PRIMARY KEY (purchase_order_id, item_id)
);

-- =======================
-- CUSTOMER ORDER
-- =======================
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    shopify_order_id BIGINT,
    order_date TIMESTAMP NOT NULL,
    name VARCHAR(64) NOT NULL,
    contact VARCHAR(16) NOT NULL,
    street VARCHAR(254) NOT NULL,
    unit VARCHAR(16),
    postal_code CHAR(6) NOT NULL
);

-- =======================
-- ORDER ITEM
-- =======================
CREATE TABLE order_item (
    order_id INT REFERENCES "order"(order_id) ON DELETE CASCADE NOT NULL,
    item_id INT REFERENCES item(id) ON DELETE CASCADE NOT NULL,
    qty_requested INT NOT NULL,
    tag TEXT[],  -- PostgreSQL array to mimic a SET
    delivery_date DATE NOT NULL,
    delivery_time TIME,
    team_assigned VARCHAR(32),
    delivered BOOLEAN NOT NULL,
    custom TEXT,
    remarks TEXT,
    value DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, item_id)
);
