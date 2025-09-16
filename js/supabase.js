// Supabase Configuration - Emergency Fix Version
const SUPABASE_URL = 'https://nmrbzdwhzbkbpmizxqvo.supabase.co';

// 🔑 THAY ĐỔI API KEY TẠI ĐÂY (lấy từ Supabase Dashboard > Settings > API)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcmJ6ZHdoemJrYnBtaXp4cXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5ODYzOTYsImV4cCI6MjA3MzU2MjM5Nn0.ojLDOWCOR0nFxn8jl9SIr4gS4xOmhPQGM7QIEtez1Wk';

// Global variables
let supabase;
let isSupabaseReady = false;

// Initialize Supabase when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await loadSupabase();
});

async function loadSupabase() {
    try {
        console.log('🔄 Loading Supabase...');
        
        // Check API key
        if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
            throw new Error('API key not configured. Please update SUPABASE_ANON_KEY in js/supabase.js');
        }
        
        // Load Supabase from CDN if not loaded
        if (typeof window.supabase === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
        }
        
        // Initialize client
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        console.log('✅ Supabase client created');
        
        // Test connection with simple query
        await testConnection();
        
        isSupabaseReady = true;
        console.log('✅ Supabase ready!');
        
        // Hide error messages if any
        hideError();
        
    } catch (error) {
        console.error('❌ Supabase initialization failed:', error);
        showError('Database connection failed: ' + error.message);
        isSupabaseReady = false;
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function testConnection() {
    try {
        // Simple test query that shouldn't trigger RLS issues
        const { data, error } = await supabase
            .from('admins')
            .select('count', { count: 'exact', head: true });
            
        if (error) {
            console.warn('⚠️ Test query failed:', error.message);
            // Don't throw error, might be table doesn't exist yet
        } else {
            console.log('✅ Database connection successful');
        }
        
    } catch (error) {
        console.warn('⚠️ Connection test failed:', error.message);
        // Don't throw, let the app continue
    }
}

function showError(message) {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.innerHTML = `
            <h4>❌ Kết nối thất bại:</h4>
            <p>${message}</p>
            <div class="alert alert-warning">
                <h5>⚠️ Vui lòng setup database trước</h5>
                <ul>
                    <li>Chỉ chạy setup này một lần khi mới cài đặt</li>
                    <li>Đảm bảo đã setup database Supabase trước</li>
                    <li>Tài khoản này sẽ có quyền quản trị cao nhất</li>
                </ul>
            </div>
        `;
        errorDiv.style.display = 'block';
    }
}

function hideError() {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Admin Management Functions
async function createFirstAdmin(adminData) {
    try {
        if (!isSupabaseReady) {
            throw new Error('Database not ready. Please refresh the page.');
        }
        
        console.log('🔄 Creating first admin...');
        
        // Check if any admin exists
        const { count, error: countError } = await supabase
            .from('admins')
            .select('*', { count: 'exact', head: true });
            
        if (countError) {
            console.error('Count error:', countError);
            throw new Error('Failed to check existing admins: ' + countError.message);
        }
        
        if (count > 0) {
            throw new Error('Admin account already exists. This setup can only be run once.');
        }
        
        // Insert new admin
        const { data, error } = await supabase
            .from('admins')
            .insert([{
                email: adminData.email,
                full_name: adminData.fullName,
                role: 'super_admin',
                is_active: true,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
            
        if (error) {
            console.error('Insert error:', error);
            throw new Error('Failed to create admin: ' + error.message);
        }
        
        console.log('✅ Admin created successfully:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Create admin failed:', error);
        throw error;
    }
}

async function checkAdminExists() {
    try {
        if (!isSupabaseReady) {
            return false;
        }
        
        const { count, error } = await supabase
            .from('admins')
            .select('*', { count: 'exact', head: true });
            
        if (error) {
            console.error('Check admin exists error:', error);
            return false;
        }
        
        return count > 0;
        
    } catch (error) {
        console.error('Check admin exists failed:', error);
        return false;
    }
}

async function loginAdmin(email) {
    try {
        if (!isSupabaseReady) {
            throw new Error('Database not ready');
        }
        
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single();
            
        if (error) {
            throw new Error('Admin not found or inactive');
        }
        
        // Update last login
        await supabase
            .from('admins')
            .update({ 
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', data.id);
            
        return data;
        
    } catch (error) {
        console.error('Login admin error:', error);
        throw error;
    }
}

// Dashboard Stats Functions
async function getDashboardStats() {
    try {
        if (!isSupabaseReady) {
            return {
                totalRevenue: 0,
                totalOrders: 0,
                totalUsers: 0,
                totalProducts: 0
            };
        }
        
        // Simple queries to avoid RLS issues
        const [ordersResult, usersResult, productsResult] = await Promise.allSettled([
            supabase.from('orders').select('total_amount, status', { count: 'exact' }),
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('products').select('*', { count: 'exact', head: true })
        ]);
        
        // Calculate stats safely
        let totalRevenue = 0;
        let totalOrders = 0;
        
        if (ordersResult.status === 'fulfilled' && ordersResult.value.data) {
            const orders = ordersResult.value.data;
            totalOrders = orders.length;
            totalRevenue = orders
                .filter(order => order.status === 'delivered')
                .reduce((sum, order) => sum + (order.total_amount || 0), 0);
        }
        
        const totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0;
        const totalProducts = productsResult.status === 'fulfilled' ? (productsResult.value.count || 0) : 0;
        
        return {
            totalRevenue,
            totalOrders,
            totalUsers,
            totalProducts
        };
        
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            totalUsers: 0,
            totalProducts: 0
        };
    }
}

// Export global functions
window.supabaseClient = {
    createFirstAdmin,
    checkAdminExists,
    loginAdmin,
    getDashboardStats,
    isReady: () => isSupabaseReady,
    getClient: () => supabase
};
