-- Database: PostgreSQL

CREATE TABLE address (
  id SERIAL PRIMARY KEY,
  city varchar(255) DEFAULT NULL,
  country varchar(255) DEFAULT NULL,
  state varchar(255) DEFAULT NULL,
  street varchar(255) DEFAULT NULL,
  zip_code varchar(255) DEFAULT NULL
);


CREATE TABLE customer (
  id SERIAL PRIMARY KEY,
  first_name varchar(255) DEFAULT NULL,
  last_name varchar(255) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  UNIQUE (email)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_tracking_number varchar(255) DEFAULT NULL,
  total_price decimal(19,2) DEFAULT NULL,
  total_quantity int DEFAULT NULL,
  billing_address_id int DEFAULT NULL,
  customer_id int DEFAULT NULL,
  shipping_address_id int DEFAULT NULL,
  status varchar(128) DEFAULT NULL,
  date_created timestamp(6) DEFAULT NULL,
  last_updated timestamp(6) DEFAULT NULL,
  CONSTRAINT uk_billing_address_id UNIQUE (billing_address_id),
  CONSTRAINT uk_shipping_address_id UNIQUE (shipping_address_id),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customer (id),
  CONSTRAINT fk_billing_address_id FOREIGN KEY (billing_address_id) REFERENCES address (id),
  CONSTRAINT fk_shipping_address_id FOREIGN KEY (shipping_address_id) REFERENCES address (id)
);

CREATE INDEX idx_customer ON orders (customer_id);

CREATE TABLE order_item (
  id SERIAL PRIMARY KEY,
  image_url varchar(255) DEFAULT NULL,
  quantity int DEFAULT NULL,
  unit_price decimal(19,2) DEFAULT NULL,
  order_id int DEFAULT NULL,
  product_id int DEFAULT NULL,
  CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (id),
  CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES product (id)
);

CREATE INDEX idx_order ON order_item (order_id);