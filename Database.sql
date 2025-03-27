-- Step 1: Create the Database
CREATE DATABASE apricity_db;

-- Step 2: Connect to the Database
\c apricity_db;

-- Step 3: Create Users Table (Supervisors & Admins)
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    emp_code        VARCHAR(25) UNIQUE, -- belt_no
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(100) UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    phone          VARCHAR(15) UNIQUE,
    role           VARCHAR(20) CHECK (role IN ('admin', 'supervisor')) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create Cities Table
CREATE TABLE cities (
    city_id     SERIAL PRIMARY KEY,
    city_name   VARCHAR(100) UNIQUE NOT NULL,
	state 		VARCHAR(100) NOT NULL
);

-- Step 5: Create Zones Table
CREATE TABLE zones (
    zone_id     SERIAL PRIMARY KEY,
    zone_name   VARCHAR(100) NOT NULL,
    city_id     INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    CONSTRAINT unique_zone_per_city UNIQUE (zone_name, city_id)
);
-- Step 6: Create Wards Table
CREATE TABLE wards (
    ward_id     SERIAL PRIMARY KEY,
    ward_name   VARCHAR(100) NOT NULL,
    zone_id     INT NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE,
    CONSTRAINT unique_ward_per_zone UNIQUE (ward_name, zone_id)
);

-- Step 7: Create Supervisor-Ward Mapping Table (Many-to-Many)
CREATE TABLE supervisor_ward (
    assigned_id    SERIAL PRIMARY KEY,
    supervisor_id  INT NOT NULL,
    ward_id        INT NOT NULL,
    UNIQUE (supervisor_id, ward_id),
    FOREIGN KEY (supervisor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE
);


-- Step 8: Create Department Table
CREATE TABLE department (
    department_id   SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

-- Step 9: Create Designation Table
CREATE TABLE designation (
    designation_id   SERIAL PRIMARY KEY,
    designation_name VARCHAR(100) NOT NULL,
    department_id    INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE,
    CONSTRAINT unique_designation_per_department UNIQUE (designation_name, department_id)
);

-- Step 10: Create Employee Table
CREATE TABLE employee (
    emp_id      SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    emp_code    VARCHAR(50) UNIQUE NOT NULL, -- belt_no
    phone       VARCHAR(15) ,
    ward_id     INT NOT NULL,
	designation_id	INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	face_confidence DECIMAL(5,2),
	face_embedding TEXT,
	face_id VARCHAR(255),
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE,
    FOREIGN KEY (designation_id) REFERENCES designation(designation_id) ON DELETE CASCADE
);

-- Step 11: Create Attendance Table
CREATE TABLE attendance (
    attendance_id   SERIAL PRIMARY KEY,
    emp_id          INT NOT NULL,
    ward_id         INT NOT NULL,
    date            DATE NOT NULL,
    punch_in_time   TIMESTAMP,
    punch_out_time  TIMESTAMP,
    duration        VARCHAR(5), -- Format: HH:MM
    punch_in_image  TEXT,  -- Image URL
    punch_out_image TEXT,  -- Image URL
    latitude_in     VARCHAR(50), 
    longitude_in    VARCHAR(50),
    in_address      VARCHAR(500),
    latitude_out    VARCHAR(50), 
    longitude_out   VARCHAR(50),
    out_address     VARCHAR(500),
    FOREIGN KEY (emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE,
    UNIQUE (emp_id, date) -- Ensures only one attendance per worker per day
);


-- demo data
-- Insert Users (Admins & Supervisors)
INSERT INTO users (emp_code, name, email, password_hash, phone, role) VALUES 
('EMP001', 'John Admin', 'admin@example.com', 'hashed_password_1', '9876543210', 'admin'),
('EMP002', 'Alice Supervisor', 'alice@example.com', 'hashed_password_2', '9876543211', 'supervisor'),
('EMP003', 'Bob Supervisor', 'bob@example.com', 'hashed_password_3', '9876543212', 'supervisor');


-- Insert Cities
INSERT INTO cities (city_name, state) VALUES 
('New York', 'New York'),
('Los Angeles', 'California'),
('Chicago', 'Illinois');


-- Insert Zones
INSERT INTO zones (zone_name, city_id) VALUES 
('North Zone', 1),
('South Zone', 1),
('West Zone', 2);

-- Insert Wards
INSERT INTO wards (ward_name, zone_id) VALUES 
('Ward A', 1),
('Ward B', 2),
('Ward C', 3);


-- Insert Supervisor-Ward Mapping
INSERT INTO supervisor_ward (supervisor_id, ward_id) VALUES 
(2, 1),  -- Alice supervises Ward A
(2, 2),  -- Alice supervises Ward B
(3, 3);  -- Bob supervises Ward C

-- Insert Departments
INSERT INTO department (department_name) VALUES 
('HR'),
('IT'),
('Operations');

-- Insert Designations
INSERT INTO designation (designation_name, department_id) VALUES 
('Manager', 1),
('Software Engineer', 2),
('Field Officer', 3);


-- Insert Employees
INSERT INTO employee (name, emp_code, phone, ward_id, designation_id) VALUES 
('David Johnson', 'E001', '9000000001', 1, 1),
('Emma Brown', 'E002', '9000000002', 2, 2),
('Michael Lee', 'E003', '9000000003', 3, 3),
('Sarah Wilson', 'E004', '9000000004', 1, 3),
('James Smith', 'E005', '9000000005', 2, 2);


-- Insert Attendance
INSERT INTO attendance (emp_id, ward_id, date, punch_in_time, punch_out_time, duration, punch_in_image, punch_out_image, latitude_in, longitude_in, in_address, latitude_out, longitude_out, out_address) VALUES 
(1, 1, '2024-02-26', '2024-02-26 08:00:00', '2024-02-26 17:00:00', '09:00', 'in_1.jpg', 'out_1.jpg', '40.7128', '-74.0060', 'New York Office', '40.7128', '-74.0060', 'New York Office'),
(2, 2, '2024-02-26', '2024-02-26 09:00:00', '2024-02-26 18:00:00', '09:00', 'in_2.jpg', 'out_2.jpg', '34.0522', '-118.2437', 'LA Office', '34.0522', '-118.2437', 'LA Office'),
(3, 3, '2024-02-26', '2024-02-26 07:30:00', '2024-02-26 16:30:00', '09:00', 'in_3.jpg', 'out_3.jpg', '41.8781', '-87.6298', 'Chicago Office', '41.8781', '-87.6298', 'Chicago Office'),
(4, 1, '2024-02-26', '2024-02-26 08:15:00', '2024-02-26 17:15:00', '09:00', 'in_4.jpg', 'out_4.jpg', '40.7128', '-74.0060', 'New York Office', '40.7128', '-74.0060', 'New York Office'),
(5, 2, '2024-02-26', '2024-02-26 09:30:00', '2024-02-26 18:30:00', '09:00', 'in_5.jpg', 'out_5.jpg', '34.0522', '-118.2437', 'LA Office', '34.0522', '-118.2437', 'LA Office');


-- ALTER TABLE employee 
-- ADD COLUMN IF NOT EXISTS face_confidence DECIMAL(5,2),
-- ADD COLUMN IF NOT EXISTS face_embedding TEXT;

-- ALTER TABLE employee ADD COLUMN IF NOT EXISTS face_id VARCHAR(255);