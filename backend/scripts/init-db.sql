-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS itpm_db;
USE itpm_db;

-- Create users table with authentication fields
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX idx_email ON users(email);

-- Add sample data (optional)
-- INSERT INTO users (name, email, password) VALUES ('John Doe', 'john@example.com', 'hashed_password_here');
