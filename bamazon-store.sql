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
VALUES ("Pack of Chicken Chews", "Pet - Dog - Treats", 10.00, 40);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Individiual Peanut Butter Bone", "Pet - Dog - Treats", 2.00, 75);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Individual Salmon Jerky Piece", "Pet - Dog - Treats", 2.75, 75);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Stuffed Squirrel", "Pet - Dog - Toys", 7.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Stuffed Hippo", "Pet - Dog - Toys", 8.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Stuffed Pig", "Pet - Dog - Toys", 9.00, 25);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Xsmall)", "Pet - Dog - Accessories", 10.00, 25);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Small)", "Pet - Dog - Accessories", 12.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Medium)", "Pet - Dog - Accessories", 14.00, 50);

INSERT INTO inventory (item, category, price, quantity)
VALUES ("Hoodie - Red (Large)", "Pet - Dog - Accessories", 16.00, 25); 