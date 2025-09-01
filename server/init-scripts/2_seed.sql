-- =======================
-- USERS
-- =======================
INSERT INTO "user" (name, role, email, password_hash) VALUES
('admintest', 'admin', 'admin@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest', 'user', 'user@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO');

-- =======================
-- SUPPLIERS
-- =======================
INSERT INTO supplier (id, name, description, email, contact_number) VALUES
(1, 'Component Solutions Inc.', 'Supplier for raw furniture components', 'sales@componentsolutions.com', '+1-800-555-0101'),
(2, 'Fine Finish Furnishings', 'Supplier for assembled furniture', 'contact@finefinish.com', '+65 6789 1234'),
(3, 'TechSource Electronics', 'Distributor of computer peripherals', 'orders@techsource.sg', '+65 6222 3333');

-- =======================
-- ITEMS
-- =======================
INSERT INTO "item" (id, sku, type, item_name, variant, qty, threshold_qty) VALUES
(1, 'CHAIR-001', 'Furniture', 'Office Chair', 'Black', 15, 10),
(2, 'DESK-001', 'Furniture', 'Standing Desk', 'Oak', 8, 5),
(3, 'MONITOR-001', 'Electronics', '27-inch Monitor', 'Silver', 3, 5),
(4, 'KEYBOARD-001', 'Electronics', 'Mechanical Keyboard', NULL, 12, 8),
(5, 'MOUSE-001', 'Electronics', 'Wireless Mouse', 'Black', 7, 10),
(6, 'LAMP-001', 'Lighting', 'Desk Lamp', 'White', 20, 15),
(7, 'LEG-STL-01', 'Component', 'Chair Leg', 'Steel', 100, 20),
(8, 'SEAT-PAD-01', 'Component', 'Seat Cushion', 'Foam', 50, 10),
(9, 'BACK-RST-01', 'Component', 'Backrest Frame', 'Plastic', 50, 10),
(10, 'SCRW-PK-01', 'Component', 'Screw Pack', 'M6', 200, 50),
(11, 'DESK-TOP-01', 'Component', 'Desk Tabletop', 'Oak Veneer', 20, 5),
(12, 'DESK-LEG-01', 'Component', 'Desk Leg Set', 'Motorized', 20, 5);

-- =======================
-- SUPPLIER_ITEM
-- =======================
INSERT INTO supplier_item (id, item_id, supplier_id) VALUES
-- Component Solutions Inc. supplies all components
(1, 7, 1), (2, 8, 1), (3, 9, 1), (4, 10, 1), (5, 11, 1), (6, 12, 1),
-- Fine Finish Furnishings supplies assembled furniture
(7, 1, 2), (8, 2, 2),
-- TechSource Electronics supplies peripherals
(9, 3, 3), (10, 4, 3), (11, 5, 3),
-- Desk Lamps are also supplied by TechSource
(12, 6, 3);

-- =======================
-- ITEM_COMPONENT (Bill of Materials)
-- =======================
INSERT INTO "item_component" (parent_id, child_id, qty_required) VALUES
-- Office Chair components
(1, 7, 4), (1, 8, 1), (1, 9, 1), (1, 10, 1),
-- Standing Desk components
(2, 11, 1), (2, 12, 1);

-- =======================
-- PURCHASE ORDER
-- =======================
INSERT INTO purchase_order (id, supplier_id, user_id, order_date) VALUES
-- PO to restock components, placed by the admin user
(1, 1, 1, '2025-08-15 11:30:00'),
-- PO to restock electronics, placed by a regular user
(2, 3, 2, '2025-08-22 16:00:00');

-- =======================
-- PURCHASE ORDER ITEM
-- =======================
INSERT INTO purchase_order_item (purchase_order_id, item_id, qty, supplier_item_id) VALUES
-- Items for PO #1 (from Component Solutions Inc.)
(1, 7, 50, 1),  -- 50 Chair Legs
(1, 10, 100, 4), -- 100 Screw Packs
(1, 12, 10, 6),   -- 10 Desk Leg Sets
-- Items for PO #2 (from TechSource Electronics)
(2, 3, 10, 9),   -- 10 Monitors
(2, 5, 15, 11);  -- 15 Wireless Mice

-- =======================
-- CUSTOMER ORDER
-- =======================
INSERT INTO "order" (order_id, shopify_order_id, order_date, name, contact, street, unit, postal_code) VALUES
(1, 1001, '2025-08-20 10:00:00+08', 'Alice Tan', '91234567', '123 Ang Mo Kio Ave 1', '#01-01', '560123'),
(2, 1002, '2025-08-28 15:30:00+08', 'Bob Lim', '98765432', '456 Clementi Rd', NULL, '123456'),
(3, 1003, '2025-09-01 09:45:00+08', 'Charlie Chan', '81112222', '789 Orchard Boulevard', '#10-11', '238879');

-- =======================
-- ORDER ITEM
-- =======================
INSERT INTO "order_item" (order_id, item_id, qty_requested, tag, delivery_date, delivery_time, team_assigned, delivered, custom, remarks, value) VALUES
-- Items for Order 1
(1, 1, 2, '{"shopee"}', '2025-08-25', '14:00:00', 'Team A', true, NULL, 'Leave at doorstep if no one is home.', 150.00),
(1, 6, 1, '{"shopee"}', '2025-08-25', '14:00:00', 'Team A', true, NULL, NULL, 45.50),
-- Items for Order 2
(2, 2, 1, '{"private"}', '2025-09-05', '10:30:00', 'Team B', false, 'Custom engraving: "Carpe Diem"', 'Call upon arrival.', 499.99),
(2, 3, 1, NULL, '2025-09-05', '10:30:00', 'Team B', false, NULL, NULL, 320.00),
-- Items for Order 3
(3, 4, 1, '{"custom"}', '2025-09-10', NULL, NULL, false, 'Red switches, custom keycaps', NULL, 189.90),
(3, 5, 1, '{"private", "custom"}', '2025-09-10', NULL, NULL, false, NULL, 'Birthday gift, please include gift wrap.', 79.50),
(3, 10, 5, NULL, '2025-09-10', NULL, NULL, false, NULL, 'Extra parts', 5.00);

-- =======================
-- USER SESSIONS
-- =======================
INSERT INTO user_session (user_id, refresh_token, created_at, expires_at) VALUES
-- Active session for the admin user
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWludGVzdCIsImlhdCI6MTcxNDI4OTAyMn0.fake_admin_token_string_for_testing_only', '2025-08-25 10:00:00', '2025-10-01 10:00:00'),
-- Active session for the regular user
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6InVzZXJ0ZXN0IiwiaWF0IjoxNzE0Mjg5MDIzfQ.fake_user_token_string_for_testing_only_2', '2025-08-31 18:30:00', '2025-10-01 18:30:00');
