-- schema.sql
CREATE DATABASE IF NOT EXISTS volcano;

USE volcano;

CREATE TABLE IF NOT EXISTS volcanoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    subregion VARCHAR(255),
    last_eruption VARCHAR(255),
    summit INT,
    elevation INT,
    population_5km INT,
    population_10km INT,
    population_30km INT,
    population_100km INT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

-- Add any other tables you need, e.g., user details table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);
