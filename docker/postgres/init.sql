-- Initialize the database with any required extensions or initial data
-- This script runs when the PostgreSQL container starts for the first time

-- Enable UUID extension (commonly used for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension (for password hashing and crypto functions)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a database for development if it doesn't exist
-- Note: This is optional since POSTGRES_DB handles the main database creation