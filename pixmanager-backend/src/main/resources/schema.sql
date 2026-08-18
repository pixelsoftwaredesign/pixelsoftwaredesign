-- =============================================
-- PixManager Database Schema (MySQL)
-- Pixel Software Design - CRM & Business Management
-- =============================================

CREATE DATABASE IF NOT EXISTS pixmanager;
USE pixmanager;

-- 1. Users Table (Team Members & RBAC)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'SALES', 'DEVELOPER') DEFAULT 'SALES',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies / Accounts (B2B Clients)
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    tax_id VARCHAR(50),
    industry VARCHAR(100),
    website VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contacts (Individual Persons linked to Companies)
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    position VARCHAR(100),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- 4. Deals / Sales Pipeline (Kanban tracking)
CREATE TABLE deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company_id INT,
    contact_id INT,
    assigned_to INT,
    stage ENUM('PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST') DEFAULT 'PROSPECTING',
    deal_value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    expected_closing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Projects (Created upon winning a deal)
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_id INT,
    name VARCHAR(200) NOT NULL,
    status ENUM('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED') DEFAULT 'PLANNING',
    start_date DATE,
    deadline DATE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
);

-- 6. Tasks (Internal team work items)
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    assigned_to INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    status ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE') DEFAULT 'TODO',
    due_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Invoices & Quotations
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_id INT,
    company_id INT,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('QUOTATION', 'INVOICE') DEFAULT 'QUOTATION',
    status ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
    total_amount DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    issue_date DATE,
    due_date DATE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- =============================================
-- Sample Data for Development
-- =============================================

INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@pixelsoftwaredesign.com', '$2a$10$hashedpassword1', 'ADMIN'),
('sales1', 'sales@pixelsoftwaredesign.com', '$2a$10$hashedpassword2', 'SALES'),
('pm1', 'pm@pixelsoftwaredesign.com', '$2a$10$hashedpassword3', 'MANAGER'),
('dev1', 'dev@pixelsoftwaredesign.com', '$2a$10$hashedpassword4', 'DEVELOPER');

INSERT INTO companies (name, tax_id, industry, website, address) VALUES
('TechCorp Tunisia', '12345678/A/M/000', 'Technology', 'https://techcorp.tn', 'Tunis, Tunisia'),
('GlobalTrade SARL', '87654321/B/N/000', 'Trading', 'https://globaltrade.tn', 'Sfax, Tunisia'),
('Digital Solutions Ltd', '11223344/C/P/000', 'Digital Services', 'https://digitalsolutions.tn', 'Sousse, Tunisia');

INSERT INTO contacts (company_id, first_name, last_name, email, phone, position) VALUES
(1, 'Ahmed', 'Ben Ali', 'ahmed@techcorp.tn', '+216 71 123 456', 'Directeur Général'),
(1, 'Fatma', 'Khelifi', 'fatma@techcorp.tn', '+216 71 654 321', 'Responsable IT'),
(2, 'Mohamed', 'Trabelsi', 'mohamed@globaltrade.tn', '+216 74 111 222', 'Directeur Commercial'),
(3, 'Sarra', 'Mansour', 'sarra@digitalsolutions.tn', '+216 73 333 444', 'CEO');

INSERT INTO deals (title, company_id, contact_id, assigned_to, stage, deal_value, expected_closing_date) VALUES
('Website Redesign Project', 1, 1, 2, 'PROPOSAL', 25000.00, '2026-09-15'),
('ERP Implementation', 2, 3, 2, 'NEGOTIATION', 45000.00, '2026-10-01'),
('Mobile App Development', 3, 4, 2, 'QUALIFICATION', 35000.00, '2026-11-30'),
('Cloud Migration', 1, 2, 2, 'WON', 18000.00, '2026-08-01');

INSERT INTO projects (deal_id, name, status, start_date, deadline) VALUES
(4, 'Cloud Migration - TechCorp', 'IN_PROGRESS', '2026-08-01', '2026-12-31');

INSERT INTO tasks (project_id, assigned_to, title, description, priority, status, due_date) VALUES
(1, 4, 'Setup AWS Infrastructure', 'Configure EC2, S3, and RDS instances', 'HIGH', 'IN_PROGRESS', '2026-08-30'),
(1, 4, 'Data Migration Script', 'Write scripts to migrate data from on-premise to cloud', 'URGENT', 'TODO', '2026-09-15'),
(1, 4, 'Security Audit', 'Perform security assessment of cloud setup', 'MEDIUM', 'TODO', '2026-10-01');

INSERT INTO invoices (deal_id, company_id, invoice_number, type, status, total_amount, tax_amount, issue_date, due_date) VALUES
(4, 1, 'INV-0001', 'INVOICE', 'SENT', 18000.00, 3420.00, '2026-08-01', '2026-08-31'),
(1, 1, 'QUO-0001', 'QUOTATION', 'SENT', 25000.00, 4750.00, '2026-08-10', '2026-09-10');
