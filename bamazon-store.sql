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

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Pack of Chicken Chews", "Dog - Treats", 10.00, 40);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Individiual Peanut Butter Bone", "Dog - Treats", 2.00, 75);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Individual Salmon Jerky Piece", "Dog - Treats", 2.75, 75);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Stuffed Squirrel", "Dog - Toys", 7.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Stuffed Hippo", "Dog - Toys", 8.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Stuffed Pig", "Dog - Toys", 9.00, 25);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Xsmall)", "Dog - Accessories", 10.00, 25);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Small)", "Dog - Accessories", 12.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Medium)", "Dog - Accessories", 14.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Large)", "Dog - Accessories", 16.00, 25); 