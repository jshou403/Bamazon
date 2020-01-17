DROP DATABASE IF EXISTS pet_dept_db;
CREATE DATABASE pet_dept_db;
USE pet_dept_db;

CREATE TABLE inventory (
    id INT NOT NULL AUTO_INCREMENT,
    item VARCHAR (50) NOT NULL,
    category VARCHAR (50) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    quantity INT(10) NOT NULL,
    PRIMARY KEY (id)
);