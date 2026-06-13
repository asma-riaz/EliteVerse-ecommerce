CREATE DATABASE IF NOT EXISTS eliteverse_db;
USE eliteverse_db;

-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','customer') DEFAULT 'customer',
    phone VARCHAR(20),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES TABLE
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) DEFAULT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    images TEXT,
    featured TINYINT(1) DEFAULT 0,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ADDRESSES TABLE
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    address_line TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Pakistan',
    is_default TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ORDERS TABLE
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 150.00,
    status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
    payment_method ENUM('cod','card') DEFAULT 'cod',
    payment_status ENUM('unpaid','paid') DEFAULT 'unpaid',
    shipping_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200),
    product_image VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CART TABLE
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cart (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- REVIEWS TABLE
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- WISHLIST TABLE
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA
-- ============================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@eliteverse.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Customer (password: user123)
INSERT INTO users (name, email, password, role, phone) VALUES
('Ali Hassan', 'ali@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0300-1234567');

-- Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Electronics',  'electronics',  'Phones, laptops, gadgets',         'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('Fashion',      'fashion',      'Clothing, shoes & accessories',    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
('Home & Living','home-living',  'Furniture, decor & appliances',    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400'),
('Sports',       'sports',       'Fitness, outdoor & sports gear',   'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400'),
('Books',        'books',        'Books, stationery & education',    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400');

-- Products
INSERT INTO products (category_id, name, slug, description, price, sale_price, stock, image_url, featured) VALUES
(1, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Latest Apple flagship with titanium design, A17 Pro chip, 48MP camera system.', 450000, 420000, 15, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 1),
(1, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Samsung flagship with S Pen, 200MP camera, AI-powered features.', 380000, NULL, 20, 'https://images.unsplash.com/photo-1706439155598-9df581e4f0ea?w=500', 1),
(1, 'MacBook Pro 14"', 'macbook-pro-14', 'Apple M3 chip, 18-hour battery, stunning Liquid Retina display.', 550000, 520000, 8, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1),
(1, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise cancelling headphones with 30-hour battery.', 85000, 72000, 30, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 0),
(1, 'iPad Air M2', 'ipad-air-m2', 'Supercharged by M2 chip with 10.9-inch Liquid Retina display.', 180000, NULL, 12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 1),
(2, 'Classic Leather Jacket', 'classic-leather-jacket', 'Genuine leather jacket with modern slim fit design. Available in black and brown.', 25000, 18000, 50, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 1),
(2, 'Premium Running Shoes', 'premium-running-shoes', 'Ultra-lightweight running shoes with advanced foam cushioning.', 12000, NULL, 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 0),
(2, 'Casual Denim Jeans', 'casual-denim-jeans', 'Classic fit denim jeans, comfortable and durable for everyday wear.', 5500, 4200, 80, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 0),
(3, 'Minimalist Coffee Table', 'minimalist-coffee-table', 'Scandinavian-inspired solid wood coffee table for modern living rooms.', 35000, NULL, 10, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 0),
(3, 'Air Purifier Pro', 'air-purifier-pro', 'HEPA filter air purifier covers 500 sq ft, removes 99.9% of pollutants.', 28000, 22000, 25, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', 1),
(4, 'Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick non-slip yoga mat with alignment lines, eco-friendly material.', 4500, 3800, 60, 'https://images.unsplash.com/photo-1601925228016-a2b99b3d3e8d?w=500', 0),
(4, 'Smart Fitness Watch', 'smart-fitness-watch', 'GPS fitness tracker with heart rate, sleep tracking and 7-day battery.', 32000, 28000, 35, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500', 1),
(5, 'Clean Code Book', 'clean-code-book', 'A handbook of agile software craftsmanship by Robert C. Martin.', 3500, NULL, 40, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', 0),
(5, 'Atomic Habits', 'atomic-habits', 'The life-changing million copy bestseller by James Clear.', 2800, 2200, 55, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500', 1);

ALTER TABLE orders ADD COLUMN card_details TEXT NULL;