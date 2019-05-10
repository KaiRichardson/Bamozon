DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toaster", "Appliances", 19.99, 61);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Electronics", 49.99, 82);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blanket", "Home & Kitchen", 49.90, 101);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crock Pot", "Home & Kitchen", 39.99, 67);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Vacuum", "Home & Kitchen", 19.99, 65);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Desk Lamp", "Electronics", 50.99, 180);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hair Dryer", "Appliances", 20.56, 240);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HDMI Cable", "Electronics", 19.99, 39);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Running Shoes", "clothing", 44.99, 145);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Smart Watch", "Electronics", 158.97, 90);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Swim Trunks", "clothing", 24.99, 174);

SELECT * FROM products;