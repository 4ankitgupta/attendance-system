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
    city_name   VARCHAR(100) UNIQUE NOT NULL
);

-- Step 5: Create Zones Table
CREATE TABLE zones (
    zone_id     SERIAL PRIMARY KEY,
    zone_name   VARCHAR(100) NOT NULL,
    city_id     INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Step 6: Create Wards Table
CREATE TABLE wards (
    ward_id     SERIAL PRIMARY KEY,
    ward_name   VARCHAR(100) NOT NULL,
    zone_id     INT NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE
);

-- Step 7: Create Employee Table
CREATE TABLE employee (
    emp_id      SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    emp_code    VARCHAR(50) UNIQUE NOT NULL, -- belt_no
    phone       VARCHAR(15) UNIQUE,
    ward_id     INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE
);

-- Step 8: Create Supervisor-Ward Mapping Table (Many-to-Many)
CREATE TABLE supervisor_ward (
    supervisor_id  INT NOT NULL,
    ward_id        INT NOT NULL,
    PRIMARY KEY (supervisor_id, ward_id),
    FOREIGN KEY (supervisor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE
);

-- Step 9: Create Department Table
CREATE TABLE department (
    department_id   SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

-- Step 10: Create Designation Table
CREATE TABLE designation (
    designation_id   SERIAL PRIMARY KEY,
    designation_name VARCHAR(100) UNIQUE NOT NULL,
    department_id    INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
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
