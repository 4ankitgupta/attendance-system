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
    supervisor_id  INT NOT NULL,
    ward_id        INT NOT NULL,
    PRIMARY KEY (supervisor_id, ward_id),
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
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE,
    FOREIGN KEY (designation_id) REFERENCES designation(designation_id) ON DELETE CASCADE
);

-- Step 11: Create Attendance Table
CREATE TABLE attendance (
    attendance_id    SERIAL PRIMARY KEY,
    emp_id          INT NOT NULL,
    supervisor_id   INT NOT NULL,
    ward_id         INT NOT NULL,
    designation_id  INT NOT NULL,
    status         VARCHAR(10) CHECK (status IN ('present', 'absent', 'leave')) NOT NULL,
    date           DATE NOT NULL,
    punch_in_time  TIMESTAMP,
    punch_out_time TIMESTAMP,
    punch_in_image TEXT,  -- Image URL
    punch_out_image TEXT, -- Image URL
    latitude_in    VARCHAR(50), 
    longitude_in   VARCHAR(50),
    in_address     VARCHAR(500),
    latitude_out   VARCHAR(50), 
    longitude_out  VARCHAR(50),
    out_address    VARCHAR(500),
    FOREIGN KEY (emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE,
    FOREIGN KEY (designation_id) REFERENCES designation(designation_id) ON DELETE CASCADE,
    UNIQUE (emp_id, date) -- Ensures only one attendance per worker per day
);


-- demo data
-- Insert Users (Admins & Supervisors)
INSERT INTO users (emp_code, name, email, password_hash, phone, role) VALUES
('ADM001', 'John Doe', 'john.doe@example.com', 'hashed_password_1', '9876543210', 'admin'),
('SUP001', 'Jane Smith', 'jane.smith@example.com', 'hashed_password_2', '9876543211', 'supervisor'),
('SUP002', 'Robert Brown', 'robert.brown@example.com', 'hashed_password_3', '9876543212', 'supervisor');

-- Insert Cities
INSERT INTO cities (city_name, state) VALUES
('Indore', 'Madhya Pradesh'),
('Bhopal', 'Madhya Pradesh'),
('Nagpur', 'Maharashtra');

-- Insert Zones
INSERT INTO zones (zone_name, city_id) VALUES
('Zone A', 1),
('Zone B', 2),
('Zone C', 3);

-- Insert Wards
INSERT INTO wards (ward_name, zone_id) VALUES
('Ward 1', 1),
('Ward 2', 2),
('Ward 3', 3);

-- Insert Supervisor-Ward Mapping
INSERT INTO supervisor_ward (supervisor_id, ward_id) VALUES
(2, 1),
(2, 2),
(3, 3);

-- Insert Departments
INSERT INTO department (department_name) VALUES
('Sanitation'),
('Water Management'),
('Electricity');

-- Insert Designations
INSERT INTO designation (designation_name, department_id) VALUES
('Sanitation Worker', 1),
('Water Technician', 2),
('Electrician', 3);

-- Insert Employees
INSERT INTO employee (name, emp_code, phone, ward_id, designation_id) VALUES
('Mike Johnson', 'EMP001', '9876543220', 1, 1),
('Sarah Wilson', 'EMP002', '9876543221', 2, 2),
('David Martinez', 'EMP003', '9876543222', 3, 3);

-- Insert Attendance
INSERT INTO attendance (emp_id, supervisor_id, ward_id, designation_id, status, date, punch_in_time, punch_out_time, punch_in_image, punch_out_image, latitude_in, longitude_in, in_address, latitude_out, longitude_out, out_address) VALUES
(1, 2, 1, 1, 'present', '2024-02-21', '2024-02-21 08:00:00', '2024-02-21 17:00:00', 'img_in_1.jpg', 'img_out_1.jpg', '40.7128', '-74.0060', 'NYC, USA', '40.7129', '-74.0061', 'NYC, USA'),
(2, 2, 2, 2, 'absent', '2024-02-21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, 3, 3, 'leave', '2024-02-21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
