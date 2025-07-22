CREATE TABLE users (
    name VARCHAR(64),
    role VARCHAR(10) CHECK (role IN ('admin', 'user')),
    email VARCHAR(254),
    password_hash VARCHAR(255)
);

INSERT INTO users (name, role, email, password_hash) VALUES
('Alice Johnson', 'admin', 'alice@example.com', 'hashedpassword1'),
('Bob Smith', 'user', 'bob@example.com', 'hashedpassword2'),
('Charlie Brown', 'user', 'charlie@example.com', 'hashedpassword3'),
('Dana White', 'admin', 'dana@example.com', 'hashedpassword4'),
('Eva Green', 'user', 'eva@example.com', 'hashedpassword5');
