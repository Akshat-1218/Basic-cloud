CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15),
  department VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  joining_date DATE
);

-- Optional sample records
INSERT IGNORE INTO employees (name, email, phone, department, salary, joining_date)
VALUES
('Aarav Sharma', 'aarav@example.com', '9876543210', 'Engineering', 55000.00, '2025-06-10'),
('Priya Verma', 'priya@example.com', '9876543211', 'Human Resources', 45000.00, '2025-08-15');
