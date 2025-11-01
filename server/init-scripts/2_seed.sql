-- =======================
-- USERS
-- =======================
INSERT INTO "user" (name, role, email, password_hash) VALUES
('admintest', 'admin', 'admin@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest', 'user', 'user@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest2', 'admin', 'admin2@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest3', 'admin', 'admin3@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest2', 'user', 'user2@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest3', 'user', 'user3@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest4', 'user', 'user4@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest5', 'user', 'user5@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('usertest6', 'user', 'user6@user.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest4', 'admin', 'admin4@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest5', 'admin', 'admin5@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest6', 'admin', 'admin6@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest7', 'admin', 'admin7@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO'),
('admintest8', 'admin', 'admin8@admin.com', '$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO');

-- =======================
-- SUPPLIERS
-- =======================
INSERT INTO supplier (name, description, email, contact_number) VALUES
('Component Solutions Inc.', 'Supplier for raw furniture components', 'ykleong.2022@scis.smu.edu.sg', '+1-800-555-0101'),
('Fine Finish Furnishings', 'Supplier for assembled furniture', 'ykleong.2022@scis.smu.edu.sg', '+65 6789 1234'),
('TechSource Electronics', 'Distributor of computer peripherals', 'ykleong.2022@scis.smu.edu.sg', '+65 6222 3333');

-- =======================
-- ITEMS
-- =======================
INSERT INTO "item" (sku, type, item_name, variant, qty, threshold_qty) VALUES
('CHAIR-001', 'Furniture', 'Office Chair', 'Black', 15, 10),
('DESK-001', 'Furniture', 'Standing Desk', 'Oak', 8, 5),
('MONITOR-001', 'Electronics', '27-inch Monitor', 'Silver', 3, 5),
('KEYBOARD-001', 'Electronics', 'Mechanical Keyboard', NULL, 12, 8),
('MOUSE-001', 'Electronics', 'Wireless Mouse', 'Black', 7, 10),
('LAMP-001', 'Lighting', 'Desk Lamp', 'White', 20, 15),
('LEG-STL-01', 'Component', 'Chair Leg', 'Steel', 100, 20),
('SEAT-PAD-01', 'Component', 'Seat Cushion', 'Foam', 50, 10),
('BACK-RST-01', 'Component', 'Backrest Frame', 'Plastic', 50, 10),
('SCRW-PK-01', 'Component', 'Screw Pack', 'M6', 200, 50),
('DESK-TOP-01', 'Component', 'Desk Tabletop', 'Oak Veneer', 20, 5),
('DESK-LEG-01', 'Component', 'Desk Leg Set', 'Motorized', 20, 5),
-- Additional items
('CHAIR-002', 'Furniture', 'Office Chair', 'Grey', 14, 8),
('CHAIR-003', 'Furniture', 'Office Chair', 'Blue', 10, 6),
('CHAIR-004', 'Furniture', 'Ergonomic Chair', 'Mesh Black', 9, 5),
('CHAIR-005', 'Furniture', 'Gaming Chair', 'Red', 6, 4),
('CHAIR-006', 'Furniture', 'Conference Chair', 'Black', 18, 8),
('CHAIR-007', 'Furniture', 'Visitor Chair', 'Fabric Grey', 12, 6),
('CHAIR-008', 'Furniture', 'Bar Stool', 'Wood', 16, 8),
('CHAIR-009', 'Furniture', 'Drafting Chair', 'Adjustable', 7, 4),
('CHAIR-010', 'Furniture', 'Lounge Chair', 'Leather Brown', 5, 3),
('DESK-002', 'Furniture', 'Standing Desk', 'Walnut', 7, 5),
('DESK-003', 'Furniture', 'Writing Desk', 'Pine', 11, 5),
('DESK-004', 'Furniture', 'Corner Desk', 'White', 6, 3),
('DESK-005', 'Furniture', 'Executive Desk', 'Dark Oak', 4, 2),
('TABLE-001', 'Furniture', 'Coffee Table', 'Glass', 8, 3),
('TABLE-002', 'Furniture', 'Dining Table', '6-Seater', 5, 2),
('TABLE-003', 'Furniture', 'Side Table', 'Round', 10, 4),
('SHELF-001', 'Furniture', 'Bookshelf', '5-Tier', 9, 4),
('SHELF-002', 'Furniture', 'Bookshelf', '3-Tier', 12, 5),
('CABINET-001', 'Furniture', 'Filing Cabinet', '3-Drawer', 7, 3),
('CABINET-002', 'Furniture', 'Storage Cabinet', 'Metal', 6, 3),
('SOFA-001', 'Furniture', 'Two-Seater Sofa', 'Grey', 3, 2),
('SOFA-002', 'Furniture', 'Three-Seater Sofa', 'Blue', 2, 1),
('BED-001', 'Furniture', 'Bed Frame', 'Queen - Oak', 4, 2),
('BED-002', 'Furniture', 'Bed Frame', 'King - Walnut', 3, 2),
('MONITOR-002', 'Electronics', '24-inch Monitor', 'Black', 8, 5),
('MONITOR-003', 'Electronics', '32-inch Monitor', '4K', 5, 5),
('MONITOR-004', 'Electronics', 'Ultrawide Monitor', '34-inch', 3, 3),
('KEYBOARD-002', 'Electronics', 'Mechanical Keyboard', 'TKL', 10, 6),
('KEYBOARD-003', 'Electronics', 'Wireless Keyboard', 'Silver', 9, 6),
('MOUSE-002', 'Electronics', 'Wireless Mouse', 'White', 10, 8),
('MOUSE-003', 'Electronics', 'Ergonomic Mouse', 'Right-Hand', 7, 5),
('DOCK-001', 'Electronics', 'USB-C Docking Station', '12-in-1', 6, 3),
('HUB-001', 'Electronics', 'USB 3.0 Hub', '4-Port', 15, 8),
('WEBCAM-001', 'Electronics', '1080p Webcam', 'Autofocus', 10, 5),
('SPEAKER-001', 'Electronics', 'Bluetooth Speaker', 'Compact', 12, 6),
('SPEAKER-002', 'Electronics', 'Desktop Speakers', '2.1', 7, 4),
('HEADSET-001', 'Electronics', 'Wireless Headset', 'Noise-Canceling', 8, 4),
('UPS-001', 'Electronics', 'UPS', '1000VA', 4, 2),
('CABLE-HDMI-01', 'Electronics', 'HDMI Cable', '2m', 50, 20),
('CABLE-USB-C-01', 'Electronics', 'USB-C Cable', '1m', 60, 25),
('MOUSEPAD-001', 'Electronics', 'Mouse Pad', 'XL', 30, 10),
('MONITOR-ARM-01', 'Electronics', 'Monitor Arm', 'Single', 14, 6),
('MONITOR-ARM-02', 'Electronics', 'Monitor Arm', 'Dual', 10, 5),
('SURGE-PRT-01', 'Electronics', 'Surge Protector', '6-Outlet', 18, 8),
('LAMP-002', 'Lighting', 'Floor Lamp', 'Black', 12, 6),
('LAMP-003', 'Lighting', 'Desk Lamp', 'Black', 15, 10),
('LAMP-004', 'Lighting', 'LED Strip', 'RGB', 30, 12),
('LAMP-005', 'Lighting', 'Pendant Lamp', 'Brass', 6, 3),
('LED-BULB-001', 'Lighting', 'LED Bulb', 'Warm White', 100, 30),
('LED-BULB-002', 'Lighting', 'LED Bulb', 'Daylight', 90, 30),
('LED-BULB-003', 'Lighting', 'Smart LED Bulb', 'RGB', 40, 12),
('LEG-STL-02', 'Component', 'Chair Leg', 'Aluminum', 120, 25),
('SEAT-PAD-02', 'Component', 'Seat Cushion', 'Memory Foam', 40, 10),
('BACK-RST-02', 'Component', 'Backrest Frame', 'Steel', 40, 10),
('ARM-REST-01', 'Component', 'Armrest Pair', 'PU', 60, 15),
('GAS-LIFT-01', 'Component', 'Gas Lift Cylinder', 'Class 4', 45, 10),
('CASTER-SET-01', 'Component', 'Caster Wheel Set', '60mm', 80, 20),
('SCRW-PK-02', 'Component', 'Screw Pack', 'M4', 180, 50),
('SCRW-PK-03', 'Component', 'Screw Pack', 'Wood', 160, 40),
('DESK-TOP-02', 'Component', 'Desk Tabletop', 'Walnut Veneer', 15, 5),
('DESK-LEG-02', 'Component', 'Desk Leg Set', 'Fixed', 25, 6),
('DESK-LEG-02-2', 'Component', 'Desk Leg Set 2', 'Fixed', 25, 6),('DESK-FRM-03', 'Component', 'Desk Frame', 'Adjustable', 20, 5),
('CABLE-ETH-01', 'Electronics', 'Ethernet Cable', 'Cat6 2m', 50, 20),
('CABLE-ETH-02', 'Electronics', 'Ethernet Cable', 'Cat6 5m', 40, 15),
('ADAPTER-001', 'Electronics', 'USB-C to HDMI Adapter', NULL, 25, 10),
('ADAPTER-002', 'Electronics', 'USB-C to Ethernet Adapter', NULL, 20, 8),
('SWITCH-001', 'Electronics', 'Network Switch', '8-Port Gigabit', 10, 5),
('ROUTER-001', 'Electronics', 'Wi-Fi Router', 'AX3000', 8, 4),
('CAMERA-001', 'Electronics', 'Security Camera', 'Indoor 1080p', 12, 6),
('CAMERA-002', 'Electronics', 'Security Camera', 'Outdoor 4K', 6, 3),
('MIC-001', 'Electronics', 'USB Microphone', 'Condenser', 10, 5),
('STAND-MIC-01', 'Component', 'Microphone Stand', 'Adjustable', 25, 10),
('STAND-MON-01', 'Component', 'Monitor Stand', 'Wood', 15, 5),
('STAND-LAP-01', 'Component', 'Laptop Stand', 'Aluminum', 20, 8),
('EXT-CORD-01', 'Electronics', 'Extension Cord', '3m', 30, 10),
('EXT-CORD-02', 'Electronics', 'Extension Cord', '5m', 25, 10),
('PLANT-001', 'Furniture', 'Artificial Plant', 'Medium', 15, 5),
('PLANT-002', 'Furniture', 'Artificial Plant', 'Large', 10, 5),
('CLOCK-001', 'Decor', 'Wall Clock', 'Round White', 10, 4),
('RUG-001', 'Decor', 'Office Rug', 'Grey', 8, 3),
('PAINT-001', 'Decor', 'Wall Art', 'Abstract', 6, 2),
('CABINET-003', 'Furniture', 'Storage Cabinet', 'Wood', 6, 3),
('CABINET-004', 'Furniture', 'Filing Cabinet', 'Metal', 5, 2),
('CUSHION-001', 'Decor', 'Throw Cushion', 'Blue', 20, 10),
('TRAY-001', 'Office Supply', 'Desk Organizer Tray', 'Plastic', 25, 10),
('BIND-001', 'Office Supply', 'File Binder', 'A4', 40, 15),
('PAPER-001', 'Office Supply', 'Printing Paper', 'A4 Ream', 60, 20),
('WHITEBOARD-001', 'Office Supply', 'Whiteboard', 'Magnetic 90x60cm', 8, 4);

-- =======================
-- SUPPLIER_ITEM
-- =======================
INSERT INTO supplier_item (item_id, supplier_id, si_sku) VALUES
-- Component Solutions Inc. supplies all components
(7, 1, NULL), (8, 1, NULL), (9, 1, NULL), (10, 1, NULL), (11, 1, NULL), (12, 1, NULL),
-- Fine Finish Furnishings supplies assembled furniture
(1, 2, NULL), (2, 2, NULL),
-- TechSource Electronics supplies peripherals
(3, 3, NULL), (4, 3, NULL), (5, 3, NULL),
-- Desk Lamps are also supplied by TechSource
(6, 3, NULL);

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
INSERT INTO purchase_order (supplier_id, user_id, order_date, status) VALUES
-- PO to restock components, placed by the admin user
(1, 1, '2025-08-15 11:30:00', 'pending'),
-- PO to restock electronics, placed by a regular user
(3, 2, '2025-08-22 16:00:00', 'pending');

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

-- -- =======================
-- -- CUSTOMER ORDER
-- -- =======================
-- INSERT INTO "order" (shopify_order_id, order_date, status, name, contact, street, unit, postal_code) VALUES
-- (1001, '2025-08-20 10:00:00+08', 'pending', 'Alice Tan', '91234567', '123 Ang Mo Kio Ave 1', '#01-01', '560123'),
-- (1002, '2025-08-28 15:30:00+08', 'pending', 'Bob Lim', '98765432', '456 Clementi Rd', NULL, '123456'),
-- (1003, '2025-09-01 09:45:00+08', 'pending', 'Charlie Chan', '81112222', '789 Orchard Boulevard', '#10-11', '238879'),
-- -- Additional orders
-- (1004, '2025-09-02 11:15:00+08', 'pending', 'Darren Goh', '91230001', '10 Tampines Ave 5', '#02-10', '529123'),
-- (1005, '2025-09-03 14:40:00+08', 'pending', 'Elaine Ng', '98230002', '55 Bukit Batok West Ave 8', NULL, '650555'),
-- (1006, '2025-09-04 09:05:00+08', 'pending', 'Farah Ahmad', '87650003', '21 Pasir Ris Dr 3', '#07-22', '510021'),
-- (1007, '2025-09-05 16:20:00+08', 'pending', 'Gavin Lee', '93330004', '888 Woodlands Ave 6', '#12-03', '730888'),
-- (1008, '2025-09-06 10:10:00+08', 'pending', 'Hui Min Tan', '94560005', '33 Sengkang East Way', NULL, '544886'),
-- (1009, '2025-09-07 13:25:00+08', 'pending', 'Ivan Koh', '90110006', '2 Punggol Walk', '#05-12', '828624'),
-- (1010, '2025-09-08 15:50:00+08', 'pending', 'Jasmine Ong', '97990007', '100 Hougang Ave 10', '#03-45', '538768'),
-- (1011, '2025-09-09 09:40:00+08', 'pending', 'Kelvin Chia', '81230008', '22 Yishun Ave 11', '#04-18', '768652'),
-- (1012, '2025-09-10 11:55:00+08', 'processing', 'Lydia Low', '96550009', '45 Toa Payoh Lor 5', NULL, '310045'),
-- (1013, '2025-09-11 10:35:00+08', 'processing', 'Marcus Tan', '91440010', '9 Bishan St 22', '#08-09', '570009'),
-- (1014, '2025-09-12 14:15:00+08', 'processing', 'Nicole Goh', '83830011', '6 Clementi Ave 3', '#10-04', '120006'),
-- (1015, '2025-09-13 16:45:00+08', 'processing', 'Owen Foo', '99110012', '77 Jurong West St 61', '#09-31', '640077'),
-- (1016, '2025-09-14 12:10:00+08', 'processing', 'Priya Raj', '88990013', '18 Choa Chu Kang Ave 3', '#02-07', '689861'),
-- (1017, '2025-09-15 13:30:00+08', 'processing', 'Qin Wei', '97770014', '3 Bukit Panjang Ring Rd', '#11-20', '679943'),
-- (1018, '2025-09-16 09:20:00+08', 'processing', 'Ryan Lim', '82220015', '1 Serangoon North Ave 1', NULL, '550001'),
-- (1019, '2025-09-17 17:05:00+08', 'processing', 'Sara Lee', '93330016', '12 Marine Parade Rd', '#06-06', '449282'),
-- (1020, '2025-09-18 10:50:00+08', 'processing', 'Terry Ng', '81110017', '88 Bedok North Rd', '#03-21', '460088'),
-- (1021, '2025-09-19 15:00:00+08', 'processing', 'Uma Devi', '90020018', '5 Jalan Bukit Merah', NULL, '150005'),
-- (1022, '2025-09-20 11:25:00+08', 'shipped', 'Victor Tan', '95550019', '70 Redhill Close', '#07-08', '150070'),
-- (1023, '2025-09-21 14:05:00+08', 'shipped', 'Wendy Poh', '86660020', '66 Tiong Bahru Rd', '#12-02', '160066'),
-- (1024, '2025-09-22 09:15:00+08', 'shipped', 'Xavier Chen', '91110021', '50 Queenstown Dr', NULL, '149299'),
-- (1025, '2025-09-23 13:55:00+08', 'shipped', 'Yasmin Noor', '93440022', '23 Bukit Timah Rd', '#04-15', '588179'),
-- (1026, '2025-09-24 16:35:00+08', 'shipped', 'Zachary Ho', '80220023', '11 Thomson Rd', '#05-05', '307610'),
-- (1027, '2025-09-25 10:05:00+08', 'shipped', 'Adrian Quek', '92340024', '9 River Valley Rd', '#02-19', '179039'),
-- (1028, '2025-09-26 12:50:00+08', 'shipped', 'Belinda Tan', '87770025', '18 Joo Chiat Pl', NULL, '427744'),
-- (1029, '2025-09-27 15:20:00+08', 'shipped', 'Caleb Goh', '96660026', '4 Upper Thomson Rd', '#06-12', '570004'),
-- (1030, '2025-09-28 11:45:00+08', 'shipped', 'Diana Lim', '95550027', '2 Newton Rd', '#14-01', '307995'),
-- (1031, '2025-09-29 09:30:00+08', 'delivered', 'Ethan Tan', '83330028', '7 Orchard Link', '#03-08', '237957'),
-- (1032, '2025-09-30 16:10:00+08', 'delivered', 'Fiona Ng', '98880029', '1 Kim Seng Walk', '#23-10', '239403'),
-- (1033, '2025-10-01 10:20:00+08', 'delivered', 'Gary Choo', '80110030', '88 Zion Rd', '#04-14', '247778'),
-- (1034, '2025-10-02 13:35:00+08', 'delivered', 'Hannah Yap', '97220031', '2 Jervois Rd', NULL, '248992'),
-- (1035, '2025-10-03 15:55:00+08', 'delivered', 'Isabelle Koh', '84440032', '5 Telok Blangah Way', '#09-09', '090005'),
-- (1036, '2025-10-04 11:05:00+08', 'delivered', 'Jacky Neo', '95550033', '6 Alexandra View', '#18-07', '158746'),
-- (1037, '2025-10-05 14:25:00+08', 'delivered', 'Karen Sim', '88880034', '21 Keppel Bay Dr', '#10-02', '098417'),
-- (1038, '2025-10-06 12:15:00+08', 'delivered', 'Leonard Phua', '93330035', '3 Marina Blvd', '#12-01', '018982'),
-- (1039, '2025-10-07 10:40:00+08', 'delivered', 'Megan Toh', '90110036', '1 Harbourfront Walk', '#03-03', '098585'),
-- (1040, '2025-10-08 16:30:00+08', 'delivered', 'Nathan Lee', '96660037', '10 Bayfront Ave', '#05-16', '018956'),
-- (1041, '2025-10-09 09:50:00+08', 'cancelled', 'Olivia Teo', '87770038', '8 Raffles Ave', NULL, '039802'),
-- (1042, '2025-10-10 13:45:00+08', 'cancelled', 'Peter Wong', '94560039', '2 Stadium Walk', '#02-02', '397691'),
-- (1043, '2025-10-11 11:20:00+08', 'cancelled', 'Queenie Tan', '81230040', '5 Stadium Walk', '#07-07', '397693'),
-- (1044, '2025-10-12 15:35:00+08', 'cancelled', 'Ronald Goh', '98990041', '1 Expo Dr', '#04-04', '486150'),
-- (1045, '2025-10-13 10:55:00+08', 'cancelled', 'Siti Nur', '83330042', '1 Changi Business Park', '#03-11', '486036'),
-- (1046, '2025-10-14 12:40:00+08', 'returned', 'Tomasz Kow', '95550043', '3 Tampines Central 5', '#06-20', '529509'),
-- (1047, '2025-10-15 14:00:00+08', 'returned', 'Umar Ali', '99110044', '1 Paya Lebar Rd', '#11-08', '409037'),
-- (1048, '2025-10-16 09:25:00+08', 'returned', 'Valerie Heng', '88990045', '5 Changi Business Park Cres', '#02-06', '486038'),
-- (1049, '2025-10-17 16:50:00+08', 'returned', 'Wayne Lim', '97770046', '4 Tampines Walk', '#08-10', '528523'),
-- (1050, '2025-10-18 11:35:00+08', 'returned', 'Xiu Ying', '82220047', '2 Orchard Turn', '#09-21', '238801'),
-- (1051, '2025-10-19 13:15:00+08', 'returned', 'Yong Sheng', '93330048', '8 Marina Gardens Dr', NULL, '018951'),
-- (1052, '2025-10-20 15:05:00+08', 'returned', 'Zoe Chan', '90110049', '1 Kim Seng Promenade', '#22-02', '237994'),
-- (1053, '2025-10-21 10:00:00+08', 'returned', 'Aaron Tan', '96660050', '6 Raffles Blvd', '#05-05', '039594');


-- -- =======================
-- -- ORDER ITEM
-- -- =======================
-- INSERT INTO "order_item" (order_id, item_id, qty_requested, tag, delivery_date, delivery_time, team_assigned, delivered, custom, remarks, value) VALUES
-- -- Items for Order 1
-- (1, 1, 2, '{"shopee"}', '2025-08-25', '14:00:00', 'Team A', true, NULL, 'Leave at doorstep if no one is home.', 150.00),
-- (1, 6, 1, '{"shopee"}', '2025-08-25', '14:00:00', 'Team A', true, NULL, NULL, 45.50),
-- -- Items for Order 2
-- (2, 2, 1, '{"private"}', '2025-09-05', '10:30:00', 'Team B', false, 'Custom engraving: "Carpe Diem"', 'Call upon arrival.', 499.99),
-- (2, 3, 1, NULL, '2025-09-05', '10:30:00', 'Team B', false, NULL, NULL, 320.00),
-- -- Items for Order 3
-- (3, 4, 1, '{"custom"}', '2025-09-10', NULL, NULL, false, 'Red switches, custom keycaps', NULL, 189.90),
-- (3, 5, 1, '{"private", "custom"}', '2025-09-10', NULL, NULL, false, NULL, 'Birthday gift, please include gift wrap.', 79.50),
-- (3, 10, 5, NULL, '2025-09-10', NULL, NULL, false, NULL, 'Extra parts', 5.00),

-- -- Additional order items
-- -- Order 4
-- (4, 13, 2, '{"online"}', '2025-09-07', '10:00:00', 'Team A', false, NULL, 'Call before delivery', 140.00),
-- (4, 15, 1, '{"online"}', '2025-09-07', '10:00:00', 'Team A', false, NULL, NULL, 220.00),
-- -- Order 5
-- (5, 16, 1, '{"shopee"}', '2025-09-10', '14:30:00', 'Team B', false, NULL, NULL, 179.90),
-- (5, 19, 2, '{"shopee"}', '2025-09-10', '14:30:00', 'Team B', false, NULL, 'Fragile items', 89.90),
-- -- Order 6
-- (6, 20, 1, '{"lazada"}', '2025-09-12', '09:00:00', 'Team C', false, NULL, NULL, 120.00),
-- (6, 22, 1, '{"lazada"}', '2025-09-12', '09:00:00', 'Team C', false, NULL, NULL, 350.00),
-- -- Order 7
-- (7, 23, 1, '{"online"}', '2025-09-15', '13:00:00', 'Team D', false, NULL, NULL, 279.90),
-- (7, 24, 2, '{"online"}', '2025-09-15', '13:00:00', 'Team D', false, NULL, 'Leave at guardhouse', 199.90),
-- -- Order 8
-- (8, 25, 1, '{"shopee"}', '2025-09-16', '11:30:00', 'Team A', false, NULL, NULL, 399.00),
-- (8, 26, 1, '{"shopee"}', '2025-09-16', '11:30:00', 'Team A', false, NULL, NULL, 599.00),
-- -- Order 9
-- (9, 27, 1, '{"lazada"}', '2025-09-18', '15:00:00', 'Team B', false, NULL, NULL, 189.90),
-- (9, 28, 1, '{"lazada"}', '2025-09-18', '15:00:00', 'Team B', false, NULL, 'Office setup', 219.90),
-- -- Order 10
-- (10, 29, 1, '{"online"}', '2025-09-20', '10:30:00', 'Team C', false, 'Wall-mounted installation', NULL, 799.00),
-- (10, 30, 1, '{"online"}', '2025-09-20', '10:30:00', 'Team C', false, NULL, NULL, 599.90),
-- -- Order 11
-- (11, 31, 1, '{"shopee"}', '2025-09-22', '14:00:00', 'Team D', false, NULL, NULL, 329.00),
-- (11, 32, 1, '{"shopee"}', '2025-09-22', '14:00:00', 'Team D', false, NULL, 'Handle with care', 279.90),
-- -- Order 12
-- (12, 33, 1, '{"lazada"}', '2025-09-24', '09:45:00', 'Team A', false, NULL, NULL, 159.90),
-- (12, 34, 2, '{"lazada"}', '2025-09-24', '09:45:00', 'Team A', false, NULL, NULL, 99.90),
-- -- Order 13
-- (13, 35, 1, '{"online"}', '2025-09-26', '16:15:00', 'Team B', false, 'Gift wrap', NULL, 229.00),
-- (13, 36, 1, '{"online"}', '2025-09-26', '16:15:00', 'Team B', false, NULL, NULL, 189.90),
-- -- Order 14
-- (14, 37, 1, '{"shopee"}', '2025-09-28', '11:10:00', 'Team C', false, NULL, NULL, 89.90),
-- (14, 38, 1, '{"shopee"}', '2025-09-28', '11:10:00', 'Team C', false, NULL, NULL, 119.90),
-- -- Order 15
-- (15, 39, 2, '{"lazada"}', '2025-09-30', '10:20:00', 'Team D', false, NULL, NULL, 29.90),
-- (15, 40, 1, '{"lazada"}', '2025-09-30', '10:20:00', 'Team D', false, NULL, 'Fast delivery requested', 119.90),
-- -- Order 16
-- (16, 41, 1, '{"online"}', '2025-10-02', '15:30:00', 'Team A', false, NULL, NULL, 159.90),
-- (16, 42, 1, '{"online"}', '2025-10-02', '15:30:00', 'Team A', false, NULL, NULL, 229.90),
-- -- Order 17
-- (17, 43, 2, '{"shopee"}', '2025-10-03', '12:00:00', 'Team B', false, NULL, NULL, 12.90),
-- (17, 44, 3, '{"shopee"}', '2025-10-03', '12:00:00', 'Team B', false, NULL, 'Small package', 15.90),
-- -- Order 18
-- (18, 45, 1, '{"lazada"}', '2025-10-04', '09:15:00', 'Team C', false, NULL, NULL, 24.90),
-- (18, 46, 4, '{"lazada"}', '2025-10-04', '09:15:00', 'Team C', false, NULL, NULL, 6.90),
-- -- Order 19
-- (19, 47, 1, '{"online"}', '2025-10-05', '11:45:00', 'Team D', false, NULL, NULL, 39.90),
-- (19, 48, 1, '{"online"}', '2025-10-05', '11:45:00', 'Team D', false, NULL, 'High floor', 119.90),
-- -- Order 20
-- (20, 49, 1, '{"shopee"}', '2025-10-06', '13:20:00', 'Team A', true, NULL, NULL, 22.90),
-- (20, 50, 2, '{"shopee"}', '2025-10-06', '13:20:00', 'Team A', true, NULL, NULL, 19.90),
-- -- Order 21
-- (21, 51, 1, '{"lazada"}', '2025-10-07', '10:40:00', 'Team B', true, NULL, NULL, 25.90),
-- (21, 52, 1, '{"lazada"}', '2025-10-07', '10:40:00', 'Team B', true, NULL, NULL, 49.90),
-- -- Order 22
-- (22, 53, 1, '{"online"}', '2025-10-08', '14:10:00', 'Team C', true, NULL, NULL, 199.90),
-- (22, 54, 1, '{"online"}', '2025-10-08', '14:10:00', 'Team C', true, NULL, 'Premium service', 149.90),
-- -- Order 23
-- (23, 55, 1, '{"shopee"}', '2025-10-09', '09:30:00', 'Team D', true, 'Premium membership included', NULL, 129.90),
-- (23, 56, 1, '{"shopee"}', '2025-10-09', '09:30:00', 'Team D', true, NULL, NULL, 179.90),
-- -- Order 24
-- (24, 57, 1, '{"lazada"}', '2025-10-10', '11:00:00', 'Team A', true, NULL, NULL, 49.90),
-- (24, 58, 2, '{"lazada"}', '2025-10-10', '11:00:00', 'Team A', true, NULL, NULL, 29.90),
-- -- Order 25
-- (25, 59, 1, '{"online"}', '2025-10-11', '16:20:00', 'Team B', true, NULL, NULL, 59.90),
-- (25, 60, 1, '{"online"}', '2025-10-11', '16:20:00', 'Team B', true, NULL, 'Delivery on weekend', 79.90),
-- -- Order 26
-- (26, 13, 1, '{"shopee"}', '2025-10-12', '10:15:00', 'Team C', true, NULL, NULL, 70.00),
-- (26, 15, 1, '{"shopee"}', '2025-10-12', '10:15:00', 'Team C', true, NULL, NULL, 220.00),
-- -- Order 27
-- (27, 16, 2, '{"lazada"}', '2025-10-13', '12:35:00', 'Team D', true, NULL, NULL, 179.90),
-- (27, 19, 1, '{"lazada"}', '2025-10-13', '12:35:00', 'Team D', true, NULL, NULL, 44.95),
-- -- Order 28
-- (28, 20, 1, '{"online"}', '2025-10-14', '14:45:00', 'Team A', true, NULL, NULL, 120.00),
-- (28, 22, 1, '{"online"}', '2025-10-14', '14:45:00', 'Team A', true, NULL, 'Contact before delivery', 350.00),
-- -- Order 29
-- (29, 23, 1, '{"shopee"}', '2025-10-15', '09:25:00', 'Team B', true, 'Extended warranty', NULL, 329.90),
-- (29, 24, 1, '{"shopee"}', '2025-10-15', '09:25:00', 'Team B', true, NULL, NULL, 99.95),
-- -- Order 30
-- (30, 25, 1, '{"lazada"}', '2025-10-16', '11:50:00', 'Team C', true, NULL, NULL, 399.00),
-- (30, 26, 1, '{"lazada"}', '2025-10-16', '11:50:00', 'Team C', true, NULL, 'Heavy item', 599.00),
-- -- Order 31
-- (31, 1, 1, '{"online"}', '2025-10-17', '13:40:00', 'Team D', true, NULL, 'Existing customer', 75.00),
-- (31, 6, 2, '{"online"}', '2025-10-17', '13:40:00', 'Team D', true, NULL, NULL, 91.00),
-- -- Order 32
-- (32, 2, 1, '{"shopee"}', '2025-10-18', '10:10:00', 'Team A', true, NULL, NULL, 520.00),
-- (32, 3, 1, '{"shopee"}', '2025-10-18', '10:10:00', 'Team A', true, NULL, NULL, 320.00),
-- -- Order 33
-- (33, 4, 1, '{"lazada"}', '2025-10-19', '15:30:00', 'Team B', true, 'Customized settings', NULL, 189.90),
-- (33, 5, 2, '{"lazada"}', '2025-10-19', '15:30:00', 'Team B', true, NULL, NULL, 99.80),
-- -- Order 34
-- (34, 27, 1, '{"online"}', '2025-10-20', '09:00:00', 'Team C', false, NULL, NULL, 189.90),
-- (34, 28, 1, '{"online"}', '2025-10-20', '09:00:00', 'Team C', false, NULL, 'Corporate order', 219.90),
-- -- Order 35
-- (35, 29, 1, '{"shopee"}', '2025-10-21', '14:00:00', 'Team D', false, NULL, NULL, 799.00),
-- (35, 30, 1, '{"shopee"}', '2025-10-21', '14:00:00', 'Team D', false, NULL, NULL, 599.90),
-- -- Order 36
-- (36, 31, 2, '{"lazada"}', '2025-10-22', '11:25:00', 'Team A', false, NULL, NULL, 658.00),
-- (36, 32, 1, '{"lazada"}', '2025-10-22', '11:25:00', 'Team A', false, NULL, NULL, 279.90),
-- -- Order 37
-- (37, 33, 1, '{"online"}', '2025-10-23', '10:50:00', 'Team B', false, NULL, 'Gift delivery', 159.90),
-- (37, 34, 1, '{"online"}', '2025-10-23', '10:50:00', 'Team B', false, NULL, NULL, 49.95),
-- -- Order 38
-- (38, 35, 1, '{"shopee"}', '2025-10-24', '13:10:00', 'Team C', false, NULL, NULL, 229.00),
-- (38, 36, 2, '{"shopee"}', '2025-10-24', '13:10:00', 'Team C', false, NULL, NULL, 379.80),
-- -- Order 39
-- (39, 37, 3, '{"lazada"}', '2025-10-25', '09:35:00', 'Team D', false, NULL, NULL, 269.70),
-- (39, 38, 1, '{"lazada"}', '2025-10-25', '09:35:00', 'Team D', false, NULL, 'Bulk order', 119.90),
-- -- Order 40
-- (40, 39, 10, '{"online"}', '2025-10-26', '15:45:00', 'Team A', false, NULL, NULL, 299.00),
-- (40, 40, 1, '{"online"}', '2025-10-26', '15:45:00', 'Team A', false, NULL, NULL, 119.90),
-- -- Order 41
-- (41, 41, 1, '{"shopee"}', '2025-10-27', '11:55:00', 'Team B', false, NULL, NULL, 159.90),
-- (41, 42, 1, '{"shopee"}', '2025-10-27', '11:55:00', 'Team B', false, NULL, NULL, 229.90),
-- -- Order 42
-- (42, 43, 5, '{"lazada"}', '2025-10-28', '10:05:00', 'Team C', false, NULL, 'Essential supplies', 64.50),
-- (42, 44, 3, '{"lazada"}', '2025-10-28', '10:05:00', 'Team C', false, NULL, NULL, 47.70),
-- -- Order 43
-- (43, 45, 2, '{"online"}', '2025-10-29', '12:20:00', 'Team D', false, NULL, NULL, 49.80),
-- (43, 46, 4, '{"online"}', '2025-10-29', '12:20:00', 'Team D', false, NULL, NULL, 27.60),
-- -- Order 44
-- (44, 47, 1, '{"shopee"}', '2025-10-30', '16:00:00', 'Team A', false, NULL, 'Need installation', 39.90),
-- (44, 48, 1, '{"shopee"}', '2025-10-30', '16:00:00', 'Team A', false, NULL, NULL, 119.90),
-- -- Order 45
-- (45, 49, 3, '{"lazada"}', '2025-10-31', '09:10:00', 'Team B', false, NULL, NULL, 68.70),
-- (45, 50, 2, '{"lazada"}', '2025-10-31', '09:10:00', 'Team B', false, NULL, NULL, 39.80),
-- -- Order 46
-- (46, 51, 1, '{"online"}', '2025-11-01', '14:15:00', 'Team C', false, NULL, NULL, 25.90),
-- (46, 52, 2, '{"online"}', '2025-11-01', '14:15:00', 'Team C', false, NULL, 'Office supplies', 99.80),
-- -- Order 47
-- (47, 53, 1, '{"shopee"}', '2025-11-02', '10:45:00', 'Team D', false, NULL, NULL, 199.90),
-- (47, 54, 1, '{"shopee"}', '2025-11-02', '10:45:00', 'Team D', false, NULL, NULL, 149.90),
-- -- Order 48
-- (48, 55, 1, '{"lazada"}', '2025-11-03', '12:55:00', 'Team A', false, 'Premium package', 'Express shipping', 129.90),
-- (48, 56, 1, '{"lazada"}', '2025-11-03', '12:55:00', 'Team A', false, NULL, NULL, 179.90),
-- -- Order 49
-- (49, 57, 2, '{"online"}', '2025-11-04', '11:35:00', 'Team B', false, NULL, NULL, 99.80),
-- (49, 58, 2, '{"online"}', '2025-11-04', '11:35:00', 'Team B', false, NULL, NULL, 59.80),
-- -- Order 50
-- (50, 59, 1, '{"shopee"}', '2025-11-05', '15:25:00', 'Team C', false, NULL, NULL, 59.90),
-- (50, 60, 2, '{"shopee"}', '2025-11-05', '15:25:00', 'Team C', false, NULL, NULL, 159.80),
-- -- Order 51
-- (51, 1, 1, '{"lazada"}', '2025-11-06', '10:20:00', 'Team D', false, NULL, NULL, 75.00),
-- (51, 6, 1, '{"lazada"}', '2025-11-06', '10:20:00', 'Team D', false, NULL, NULL, 45.50),
-- -- Order 52
-- (52, 2, 1, '{"online"}', '2025-11-07', '13:35:00', 'Team A', false, 'Custom height', NULL, 520.00),
-- (52, 3, 1, '{"online"}', '2025-11-07', '13:35:00', 'Team A', false, NULL, 'Need wall mount', 320.00),
-- -- Order 53
-- (53, 4, 2, '{"shopee"}', '2025-11-08', '09:05:00', 'Team B', false, 'Bundle discount', NULL, 359.80),
-- (53, 5, 2, '{"shopee"}', '2025-11-08', '09:05:00', 'Team B', false, NULL, NULL, 99.80);

-- =======================
-- USER SESSIONS
-- =======================


-- =======================================================
-- SELF-CONTAINED 3-LEVEL HIERARCHY EXAMPLE (IDs 101-109)
-- =======================================================

-- STEP 1: Define ALL necessary items with explicit IDs to guarantee they exist.

INSERT INTO "item" (sku, type, item_name, variant, qty, threshold_qty) VALUES
-- Level 1: Final Product
('CHAIR-PREM-101', 'Furniture', 'Premium Ergonomic Chair', 'Test Model', 5, 2),

-- Level 2: Sub-Assemblies
('ASSY-SEAT-102', 'Component', 'Premium Seat Assembly', 'Test Model', 10, 5),
('ASSY-BASE-103', 'Component', 'Premium Base Assembly', 'Test Model', 10, 5),

-- Level 3: All Raw Components for this specific test item
('SEAT-PAD-104', 'Component', 'Premium Seat Cushion', 'Test Model', 50, 10),
('BACK-RST-105', 'Component', 'Premium Backrest Frame', 'Test Model', 50, 10),
('FABRIC-BLK-106', 'Component', 'Premium Upholstery Fabric', 'Test Model', 100, 20),
('GAS-LIFT-107', 'Component', 'Premium Gas Lift Cylinder', 'Test Model', 45, 10),
('CASTER-SET-108', 'Component', 'Premium Caster Wheel Set', 'Test Model', 80, 20),
('BASE-STAR-109', 'Component', 'Premium Chair Base Star', 'Test Model', 30, 10);


-- STEP 2: Define the relationships using these new, guaranteed-to-exist IDs.

INSERT INTO "item_component" (parent_id, child_id, qty_required) VALUES
-- Level 1 -> Level 2 relationships
(101, 102, 1), -- Premium Chair (101) -> Seat Assembly (102)
(101, 103, 1), -- Premium Chair (101) -> Base Assembly (103)

-- Level 2 -> Level 3 relationships
-- Seat Assembly (102) requires:
(102, 104, 1), -- -> Premium Seat Cushion (104)
(102, 105, 1), -- -> Premium Backrest Frame (105)
(102, 106, 2), -- -> Premium Upholstery Fabric (106)

-- Base Assembly (103) requires:
(103, 107, 1), -- -> Premium Gas Lift (107)
(103, 108, 1), -- -> Premium Casters (108)
(103, 109, 1); -- -> Premium Base Star (109)