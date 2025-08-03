INSERT INTO "user" (name, role, email, password_hash) VALUES
('admintest', 'admin', 'admin@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO');

-- Insert sample inventory items
INSERT INTO "item" (id, sku, type, item_name, variant, qty, threshold_qty) VALUES
(1, 'CHAIR-001', 'Furniture', 'Office Chair', 'Black', 15, 10),
(2, 'DESK-001', 'Furniture', 'Standing Desk', 'Oak', 8, 5),
(3, 'MONITOR-001', 'Electronics', '27-inch Monitor', 'Silver', 3, 5),
(4, 'KEYBOARD-001', 'Electronics', 'Mechanical Keyboard', NULL, 12, 8),
(5, 'MOUSE-001', 'Electronics', 'Wireless Mouse', 'Black', 7, 10),
(6, 'LAMP-001', 'Lighting', 'Desk Lamp', 'White', 20, 15);