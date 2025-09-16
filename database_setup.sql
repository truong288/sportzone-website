-- SportZone Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'banking', 'momo')),
    subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
    shipping_cost BIGINT DEFAULT 0 CHECK (shipping_cost >= 0),
    discount_amount BIGINT DEFAULT 0 CHECK (discount_amount >= 0),
    total BIGINT NOT NULL CHECK (total >= 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_price BIGINT NOT NULL CHECK (product_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create banners table
CREATE TABLE banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE admin_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_banners_status ON banners(status);
CREATE INDEX idx_banners_sort_order ON banners(sort_order);

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES 
('Bóng đá', 'Trang thiết bị bóng đá chuyên nghiệp', 'https://via.placeholder.com/200x200/28a745/ffffff?text=Football'),
('Bóng rổ', 'Dụng cụ bóng rổ chất lượng cao', 'https://via.placeholder.com/200x200/fd7e14/ffffff?text=Basketball'),
('Tennis', 'Vợt và phụ kiện tennis', 'https://via.placeholder.com/200x200/e74c3c/ffffff?text=Tennis'),
('Chạy bộ', 'Giày và trang phục chạy bộ', 'https://via.placeholder.com/200x200/9b59b6/ffffff?text=Running'),
('Gym & Fitness', 'Thiết bị tập gym và fitness', 'https://via.placeholder.com/200x200/17a2b8/ffffff?text=Gym');

-- Insert default banners
INSERT INTO banners (title, image_url, link_url, sort_order) VALUES 
('Khuyến mãi lớn - Giảm đến 50%', 'https://via.placeholder.com/1200x400/007bff/ffffff?text=Banner+1', '#', 1),
('Sản phẩm mới 2024', 'https://via.placeholder.com/1200x400/28a745/ffffff?text=Banner+2', '#', 2),
('Miễn phí vận chuyển', 'https://via.placeholder.com/1200x400/dc3545/ffffff?text=Banner+3', '#', 3);

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) 
SELECT 
    'Giày bóng đá Nike Mercurial',
    'Giày bóng đá chuyên nghiệp Nike Mercurial với công nghệ tiên tiến',
    2500000,
    c.id,
    'https://via.placeholder.com/300x300/007bff/ffffff?text=Nike+Football',
    50
FROM categories c WHERE c.name = 'Bóng đá';

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) 
SELECT 
    'Áo thun thể thao Adidas',
    'Áo thun thể thao Adidas chất liệu thoáng mát',
    450000,
    c.id,
    'https://via.placeholder.com/300x300/28a745/ffffff?text=Adidas+Shirt',
    100
FROM categories c WHERE c.name = 'Chạy bộ';

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) 
SELECT 
    'Vợt tennis Wilson',
    'Vợt tennis Wilson Pro Staff cho người chơi chuyên nghiệp',
    3200000,
    c.id,
    'https://via.placeholder.com/300x300/e74c3c/ffffff?text=Wilson+Tennis',
    25
FROM categories c WHERE c.name = 'Tennis';

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) 
SELECT 
    'Quả bóng rổ Spalding',
    'Quả bóng rổ Spalding chính hãng, chất lượng cao',
    850000,
    c.id,
    'https://via.placeholder.com/300x300/fd7e14/ffffff?text=Spalding+Ball',
    75
FROM categories c WHERE c.name = 'Bóng rổ';

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES 
('shipping_costs', '{"hanoi": 25000, "hcm": 25000, "danang": 30000, "other": 40000}'),
('bank_info', '{"bank": "Techcombank", "account_number": "19036225888018", "account_name": "SPORTZONE COMPANY"}'),
('contact_info', '{"phone": "0123 456 789", "email": "info@sportzone.vn", "address": "123 Đường ABC, Quận 1, TP.HCM"}'),
('support_hours', '{"weekdays": "8:00 - 22:00", "weekend": "8:00 - 18:00"}');

-- Create a default admin user (password: admin123)
-- Note: In production, you should use Supabase Auth UI or API to create users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'admin@sportzone.vn',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Insert admin profile
INSERT INTO users (email, full_name, role, status) VALUES 
('admin@sportzone.vn', 'SportZone Admin', 'admin', 'active');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'admin');

CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON categories
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Orders policies
CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (
        customer_email = (
            SELECT email FROM users WHERE id::text = auth.uid()::text
        )
    );

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Order items policies
CREATE POLICY "Users can view order items of their orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders o 
            WHERE o.id = order_items.order_id 
            AND (
                o.customer_email = (
                    SELECT email FROM users WHERE id::text = auth.uid()::text
                ) 
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE id::text = auth.uid()::text AND role = 'admin'
                )
            )
        )
    );

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Banners policies (public read, admin write)
CREATE POLICY "Anyone can view active banners" ON banners
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage banners" ON banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Admin settings policies (admin only)
CREATE POLICY "Admins can manage settings" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Functions to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
