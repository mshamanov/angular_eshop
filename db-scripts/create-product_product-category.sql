-- Database: PostgreSQL

CREATE TABLE product_category (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  description VARCHAR(255) DEFAULT NULL,
  unit_price DECIMAL(13,2) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  active BOOLEAN DEFAULT TRUE,
  units_in_stock INT DEFAULT NULL,
  date_created TIMESTAMP(6) DEFAULT NULL,
  last_updated TIMESTAMP(6) DEFAULT NULL,
  category_id INT NOT NULL,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES product_category (id)
);

CREATE INDEX idx_category ON product (category_id);