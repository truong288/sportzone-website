// Supabase Configuration and Database Functions

// Supabase project configuration
const SUPABASE_URL = 'https://nmrbzdwhzbkbpmizxqvo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcmJ6ZHdoemJrYnBtaXp4cXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5ODYzOTYsImV4cCI6MjA3MzU2MjM5Nn0.ojLDOWCOR0nFxn8jl9SIr4gS4xOmhPQGM7QIEtez1Wk'; // You need to get this from your Supabase dashboard

// Initialize Supabase client
let supabase;

// Load Supabase client
function loadSupabase() {
    if (typeof window.supabase === 'undefined') {
        // Load Supabase from CDN if not already loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/dist/umd/supabase.min.js';
        script.onload = initSupabase;
        document.head.appendChild(script);
    } else {
        initSupabase();
    }
}

// Initialize Supabase
function initSupabase() {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized');
}

// Database Table Schemas (for reference)
/*
1. users
   - id (uuid, primary key)
   - email (text, unique)
   - full_name (text)
   - phone (text)
   - role (text) - 'customer', 'admin'
   - created_at (timestamp)
   - last_login (timestamp)
   - status (text) - 'active', 'inactive'

2. products
   - id (uuid, primary key)
   - name (text)
   - description (text)
   - price (bigint)
   - category_id (uuid, foreign key)
   - image_url (text)
   - stock_quantity (integer)
   - status (text) - 'active', 'inactive', 'out_of_stock'
   - created_at (timestamp)
   - updated_at (timestamp)

3. categories
   - id (uuid, primary key)
   - name (text)
   - description (text)
   - image_url (text)
   - created_at (timestamp)

4. orders
   - id (uuid, primary key)
   - order_code (text, unique)
   - customer_name (text)
   - customer_email (text)
   - customer_phone (text)
   - shipping_address (jsonb)
   - payment_method (text)
   - subtotal (bigint)
   - shipping_cost (bigint)
   - discount_amount (bigint)
   - total (bigint)
   - status (text) - 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'
   - notes (text)
   - created_at (timestamp)
   - updated_at (timestamp)

5. order_items
   - id (uuid, primary key)
   - order_id (uuid, foreign key)
   - product_id (uuid, foreign key)
   - product_name (text)
   - product_price (bigint)
   - quantity (integer)
   - subtotal (bigint)

6. banners
   - id (uuid, primary key)
   - title (text)
   - image_url (text)
   - link_url (text)
   - status (text) - 'active', 'inactive'
   - sort_order (integer)
   - created_at (timestamp)

7. admin_settings
   - id (uuid, primary key)
   - setting_key (text, unique)
   - setting_value (jsonb)
   - updated_at (timestamp)
*/

// Auth Functions
async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (profileError) throw profileError;
        
        // Update last login
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', profile.id);
        
        return { user: data.user, profile };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function registerUser(userData) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password
        });
        
        if (error) throw error;
        
        // Insert user profile
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .insert([{
                id: data.user.id,
                email: userData.email,
                full_name: userData.fullName,
                phone: userData.phone,
                role: 'customer',
                status: 'active'
            }])
            .select()
            .single();
            
        if (profileError) throw profileError;
        
        return { user: data.user, profile };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear local storage
        localStorage.removeItem('currentUser');
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Product Functions
async function getProducts(filters = {}) {
    try {
        let query = supabase
            .from('products')
            .select(`
                *,
                categories (
                    id,
                    name,
                    image_url
                )
            `);
        
        if (filters.category_id) {
            query = query.eq('category_id', filters.category_id);
        }
        
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Get products error:', error);
        throw error;
    }
}

async function addProduct(productData) {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Add product error:', error);
        throw error;
    }
}

async function updateProduct(id, productData) {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ ...productData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update product error:', error);
        throw error;
    }
}

async function deleteProduct(id) {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Delete product error:', error);
        throw error;
    }
}

// Category Functions
async function getCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Get categories error:', error);
        throw error;
    }
}

async function addCategory(categoryData) {
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([categoryData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Add category error:', error);
        throw error;
    }
}

async function updateCategory(id, categoryData) {
    try {
        const { data, error } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update category error:', error);
        throw error;
    }
}

// Order Functions
async function createOrder(orderData) {
    try {
        // Start transaction
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                order_code: orderData.orderCode,
                customer_name: orderData.customer.fullName,
                customer_email: orderData.customer.email,
                customer_phone: orderData.customer.phone,
                shipping_address: orderData.shipping,
                payment_method: orderData.payment.method,
                subtotal: orderData.subtotal,
                shipping_cost: orderData.shippingCost,
                discount_amount: orderData.discountAmount || 0,
                total: orderData.total,
                status: 'pending',
                notes: orderData.notes
            }])
            .select()
            .single();
        
        if (orderError) throw orderError;
        
        // Add order items
        const orderItems = orderData.items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));
        
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        return order;
    } catch (error) {
        console.error('Create order error:', error);
        throw error;
    }
}

async function getOrders(filters = {}) {
    try {
        let query = supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *
                )
            `);
        
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Get orders error:', error);
        throw error;
    }
}

async function updateOrderStatus(id, status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ 
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update order status error:', error);
        throw error;
    }
}

// User Management Functions
async function getUsers(filters = {}) {
    try {
        let query = supabase
            .from('users')
            .select('*');
        
        if (filters.role) {
            query = query.eq('role', filters.role);
        }
        
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Get users error:', error);
        throw error;
    }
}

async function updateUserStatus(id, status) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update user status error:', error);
        throw error;
    }
}

async function createAdminUser(userData) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password
        });
        
        if (error) throw error;
        
        // Insert admin profile
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .insert([{
                id: data.user.id,
                email: userData.email,
                full_name: userData.fullName,
                role: 'admin',
                status: 'active'
            }])
            .select()
            .single();
            
        if (profileError) throw profileError;
        
        return { user: data.user, profile };
    } catch (error) {
        console.error('Create admin user error:', error);
        throw error;
    }
}

// Banner Functions
async function getBanners() {
    try {
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .order('sort_order');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Get banners error:', error);
        throw error;
    }
}

async function updateBanner(id, bannerData) {
    try {
        const { data, error } = await supabase
            .from('banners')
            .update(bannerData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update banner error:', error);
        throw error;
    }
}

// Statistics Functions
async function getDashboardStats() {
    try {
        // Get total revenue
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total, status')
            .eq('status', 'delivered');
        
        if (ordersError) throw ordersError;
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        
        // Get successful orders count
        const successfulOrders = orders.length;
        
        // Get total customers
        const { count: totalCustomers, error: customersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'customer');
        
        if (customersError) throw customersError;
        
        // Get total products
        const { count: totalProducts, error: productsError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');
        
        if (productsError) throw productsError;
        
        return {
            totalRevenue,
            successfulOrders,
            totalCustomers,
            totalProducts
        };
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        throw error;
    }
}

// Settings Functions
async function getSettings() {
    try {
        const { data, error } = await supabase
            .from('admin_settings')
            .select('*');
        
        if (error) throw error;
        
        // Convert array to object
        const settings = {};
        data.forEach(setting => {
            settings[setting.setting_key] = setting.setting_value;
        });
        
        return settings;
    } catch (error) {
        console.error('Get settings error:', error);
        throw error;
    }
}

async function updateSetting(key, value) {
    try {
        const { data, error } = await supabase
            .from('admin_settings')
            .upsert([{
                setting_key: key,
                setting_value: value,
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update setting error:', error);
        throw error;
    }
}

// Initialize Supabase when script loads
if (typeof window !== 'undefined') {
    loadSupabase();
}
