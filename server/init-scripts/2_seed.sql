INSERT INTO "user" (name, role, email, password_hash) VALUES
('admintest', 'admin', 'admin@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest', 'user', 'user@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO');

-- Insert sample inventory items
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


-- Insert sample chair item components for mapping
INSERT INTO "item_component" (parent_id, child_id, qty_required) VALUES
(1, 7, 4),   -- 4 'Chair Leg' components
(1, 8, 1),   -- 1 'Seat Cushion' component
(1, 9, 1),   -- 1 'Backrest Frame' component
(1, 10, 1);  -- 1 'Screw Pack' component

-- Insert desk item components for mapping
INSERT INTO "item_component" (parent_id, child_id, qty_required) VALUES
(2, 11, 1),  -- 1 'Desk Tabletop' component
(2, 12, 4);  -- 4 'Desk Leg Set' component