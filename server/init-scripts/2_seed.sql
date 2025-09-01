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

-- Insert into order
INSERT INTO "order" (order_id, shopify_order_id, order_date, name,  contact, street, unit, postal_code) VALUES
(1, 1001, '2023-01-01', 'John Doe', '1234567890', '123 Elm St', 'Apt 1', '12345'),
(2, 1002, '2023-01-02', 'Jane Smith', '0987654321', '456 Oak St', 'Apt 2', '54321');

-- Insert into orderitem
INSERT INTO "order_item" (order_id, item_id, qty_requested, tag, delivery_date, delivery_time, team_assigned, delivered, custom, remarks, value) VALUES
(1, 1, 1, ARRAY['Tag A'], DATE '2023-01-03', TIME '10:00:00', 'Team A', false, NULL, '', 199.99),
(1, 2, 1, ARRAY['Tag B'], DATE '2023-01-04', TIME '11:00:00', 'Team B', false, NULL, '', 399.00),
(1, 3, 1, ARRAY['Tag C'], DATE '2023-01-05', TIME '12:00:00', 'Team C', false, NULL, '', 299.50),
(2, 1, 4, ARRAY['Tag D'], DATE '2023-01-06', TIME '13:00:00', 'Team D', false, NULL, '', 799.00);