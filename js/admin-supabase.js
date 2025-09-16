// Updated Admin JavaScript with Supabase Integration

// Admin state management
const adminState = {
    currentSection: 'dashboard',
    currentUser: null,
    isLoading: false,
    filters: {
        products: { search: '', category: '', status: '' },
        orders: { search: '', status: '' },
        users: { search: '', status: '' }
    },
    pagination: {
        products: { page: 1, limit: 10 },
        orders: { page: 1, limit: 10 },
        users: { page: 1, limit: 10 }
    }
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', async function() {
    await initializeAdmin();
});

async function initializeAdmin() {
    try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        // Get user profile
        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error || !profile || profile.role !== 'admin') {
            alert('Không có quyền truy cập trang admin!');
            window.location.href = 'index.html';
            return;
        }
        
        adminState.currentUser = profile;
        document.getElementById('admin-name').textContent = profile.full_name;
        
        // Load dashboard
        await loadDashboard();
        showSection('dashboard');
        setupEventListeners();
        
    } catch (error) {
        console.error('Admin initialization error:', error);
        alert('Lỗi khởi tạo trang admin!');
        window.location.href = 'index.html';
    }
}

function setupEventListeners() {
    // Form submissions
    document.getElementById('add-product-form')?.addEventListener('submit', handleAddProduct);
    document.getElementById('add-admin-form')?.addEventListener('submit', handleAddAdmin);
    document.getElementById('general-settings-form')?.addEventListener('submit', handleGeneralSettings);
    document.getElementById('bank-info-form')?.addEventListener('submit', handleBankInfo);
    document.getElementById('support-info-form')?.addEventListener('submit', handleSupportInfo);
    
    // Search inputs with debounce
    document.getElementById('product-search')?.addEventListener('keyup', debounce(searchProducts, 300));
    document.getElementById('order-search')?.addEventListener('keyup', debounce(searchOrders, 300));
    document.getElementById('user-search')?.addEventListener('keyup', debounce(searchUsers, 300));
    
    // Filter changes
    document.getElementById('product-category-filter')?.addEventListener('change', filterProducts);
    document.getElementById('product-status-filter')?.addEventListener('change', filterProducts);
    document.getElementById('order-status-filter')?.addEventListener('change', filterOrders);
    document.getElementById('user-status-filter')?.addEventListener('change', filterUsers);
}

// Dashboard Functions
async function loadDashboard() {
    try {
        showLoading();
        
        // Get dashboard statistics
        const stats = await getDashboardStats();
        
        // Update dashboard cards
        document.getElementById('total-revenue').textContent = formatPrice(stats.totalRevenue || 0);
        document.getElementById('successful-orders').textContent = stats.successfulOrders || 0;
        document.getElementById('total-customers').textContent = stats.totalCustomers || 0;
        document.getElementById('total-products').textContent = stats.totalProducts || 0;
        
        // Load recent orders
        await loadRecentOrders();
        
        // Load charts data (simplified for now)
        await loadChartsData();
        
        hideLoading();
    } catch (error) {
        console.error('Load dashboard error:', error);
        hideLoading();
        showError('Lỗi tải dữ liệu dashboard');
    }
}

async function loadRecentOrders() {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    product_name,
                    product_price
                )
            `)
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (error) throw error;
        
        const tbody = document.querySelector('#recent-orders-table tbody');
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            const statusBadge = getStatusBadge(order.status);
            const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
            
            row.innerHTML = `
                <td>${order.order_code}</td>
                <td>${order.customer_name}</td>
                <td>${formatPrice(order.total)}</td>
                <td>${statusBadge}</td>
                <td>${formatDate(order.created_at)}</td>
                <td>
                    <button onclick="viewOrder('${order.id}')" class="btn-sm btn-primary">Chi tiết</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Load recent orders error:', error);
    }
}

async function loadChartsData() {
    // Simplified chart data loading
    // In a real application, you would create actual charts here
    console.log('Charts data loaded');
}

// Product Management Functions
async function loadProducts() {
    try {
        showLoading();
        
        let query = supabase
            .from('products')
            .select(`
                *,
                categories (
                    id,
                    name
                )
            `);
        
        // Apply filters
        if (adminState.filters.products.category) {
            query = query.eq('category_id', adminState.filters.products.category);
        }
        
        if (adminState.filters.products.status) {
            query = query.eq('status', adminState.filters.products.status);
        }
        
        if (adminState.filters.products.search) {
            query = query.ilike('name', `%${adminState.filters.products.search}%`);
        }
        
        const { data: products, error } = await query
            .order('created_at', { ascending: false })
            .range(
                (adminState.pagination.products.page - 1) * adminState.pagination.products.limit,
                adminState.pagination.products.page * adminState.pagination.products.limit - 1
            );
        
        if (error) throw error;
        
        displayProducts(products);
        hideLoading();
        
    } catch (error) {
        console.error('Load products error:', error);
        hideLoading();
        showError('Lỗi tải danh sách sản phẩm');
    }
}

function displayProducts(products) {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        const statusBadge = getStatusBadge(product.status);
        
        row.innerHTML = `
            <td>
                <img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td>${product.name}</td>
            <td>${product.categories?.name || 'N/A'}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.stock_quantity}</td>
            <td>${statusBadge}</td>
            <td>
                <button onclick="editProduct('${product.id}')" class="btn-sm btn-primary">Sửa</button>
                <button onclick="deleteProduct('${product.id}')" class="btn-sm btn-danger">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleAddProduct(event) {
    event.preventDefault();
    
    try {
        showLoading();
        
        const formData = new FormData(event.target);
        const productData = {
            name: formData.get('productName'),
            description: formData.get('productDescription'),
            price: parseInt(formData.get('productPrice')),
            category_id: formData.get('productCategory'),
            image_url: formData.get('productImage'),
            stock_quantity: parseInt(formData.get('stockQuantity')),
            status: 'active'
        };
        
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();
        
        if (error) throw error;
        
        // Reset form
        event.target.reset();
        
        // Reload products
        await loadProducts();
        
        showSuccess('Thêm sản phẩm thành công!');
        hideLoading();
        
    } catch (error) {
        console.error('Add product error:', error);
        hideLoading();
        showError('Lỗi thêm sản phẩm: ' + error.message);
    }
}

async function editProduct(id) {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        // Show edit modal with product data
        showEditProductModal(product);
        
    } catch (error) {
        console.error('Edit product error:', error);
        showError('Lỗi tải thông tin sản phẩm');
    }
}

async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        await loadProducts();
        showSuccess('Xóa sản phẩm thành công!');
        
    } catch (error) {
        console.error('Delete product error:', error);
        showError('Lỗi xóa sản phẩm: ' + error.message);
    }
}

// Order Management Functions
async function loadOrders() {
    try {
        showLoading();
        
        let query = supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    product_name,
                    product_price,
                    subtotal
                )
            `);
        
        // Apply filters
        if (adminState.filters.orders.status) {
            query = query.eq('status', adminState.filters.orders.status);
        }
        
        if (adminState.filters.orders.search) {
            query = query.or(`order_code.ilike.%${adminState.filters.orders.search}%,customer_name.ilike.%${adminState.filters.orders.search}%`);
        }
        
        const { data: orders, error } = await query
            .order('created_at', { ascending: false })
            .range(
                (adminState.pagination.orders.page - 1) * adminState.pagination.orders.limit,
                adminState.pagination.orders.page * adminState.pagination.orders.limit - 1
            );
        
        if (error) throw error;
        
        displayOrders(orders);
        hideLoading();
        
    } catch (error) {
        console.error('Load orders error:', error);
        hideLoading();
        showError('Lỗi tải danh sách đơn hàng');
    }
}

function displayOrders(orders) {
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        const statusBadge = getStatusBadge(order.status);
        
        row.innerHTML = `
            <td>${order.order_code}</td>
            <td>${order.customer_name}</td>
            <td>${formatPrice(order.total)}</td>
            <td>${statusBadge}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <button onclick="viewOrder('${order.id}')" class="btn-sm btn-primary">Chi tiết</button>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Đã xác nhận</option>
                    <option value="shipping" ${order.status === 'shipping' ? 'selected' : ''}>Đang giao</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Đã giao</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function updateOrderStatus(id, status) {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ 
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
        
        if (error) throw error;
        
        showSuccess('Cập nhật trạng thái đơn hàng thành công!');
        
    } catch (error) {
        console.error('Update order status error:', error);
        showError('Lỗi cập nhật trạng thái đơn hàng');
    }
}

async function viewOrder(id) {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        showOrderDetailsModal(order);
        
    } catch (error) {
        console.error('View order error:', error);
        showError('Lỗi tải chi tiết đơn hàng');
    }
}

// User Management Functions
async function loadUsers() {
    try {
        showLoading();
        
        let query = supabase
            .from('users')
            .select('*');
        
        // Apply filters
        if (adminState.filters.users.status) {
            query = query.eq('status', adminState.filters.users.status);
        }
        
        if (adminState.filters.users.search) {
            query = query.or(`full_name.ilike.%${adminState.filters.users.search}%,email.ilike.%${adminState.filters.users.search}%`);
        }
        
        const { data: users, error } = await query
            .order('created_at', { ascending: false })
            .range(
                (adminState.pagination.users.page - 1) * adminState.pagination.users.limit,
                adminState.pagination.users.page * adminState.pagination.users.limit - 1
            );
        
        if (error) throw error;
        
        displayUsers(users);
        hideLoading();
        
    } catch (error) {
        console.error('Load users error:', error);
        hideLoading();
        showError('Lỗi tải danh sách người dùng');
    }
}

function displayUsers(users) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const statusBadge = getStatusBadge(user.status);
        
        row.innerHTML = `
            <td>${user.full_name || 'N/A'}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button onclick="toggleUserStatus('${user.id}', '${user.status}')" 
                        class="btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}">
                    ${user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function toggleUserStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
        const { error } = await supabase
            .from('users')
            .update({ status: newStatus })
            .eq('id', id);
        
        if (error) throw error;
        
        await loadUsers();
        showSuccess('Cập nhật trạng thái người dùng thành công!');
        
    } catch (error) {
        console.error('Toggle user status error:', error);
        showError('Lỗi cập nhật trạng thái người dùng');
    }
}

// Admin Management Functions
async function loadAdminUsers() {
    try {
        const { data: admins, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayAdminUsers(admins);
        
    } catch (error) {
        console.error('Load admin users error:', error);
        showError('Lỗi tải danh sách admin');
    }
}

function displayAdminUsers(admins) {
    const tbody = document.querySelector('#admin-table tbody');
    tbody.innerHTML = '';
    
    admins.forEach(admin => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${admin.email}</td>
            <td>${admin.full_name || 'N/A'}</td>
            <td>${admin.role}</td>
            <td>${formatDate(admin.created_at)}</td>
            <td>${admin.last_login ? formatDate(admin.last_login) : 'Chưa đăng nhập'}</td>
            <td>
                <button onclick="deleteAdminUser('${admin.id}')" class="btn-sm btn-danger">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleAddAdmin(event) {
    event.preventDefault();
    
    try {
        showLoading();
        
        const formData = new FormData(event.target);
        const adminData = {
            email: formData.get('adminEmail'),
            password: formData.get('adminPassword'),
            fullName: formData.get('adminName')
        };
        
        const result = await createAdminUser(adminData);
        
        // Reset form
        event.target.reset();
        
        // Reload admin users
        await loadAdminUsers();
        
        showSuccess('Tạo tài khoản admin thành công!');
        hideLoading();
        
    } catch (error) {
        console.error('Add admin error:', error);
        hideLoading();
        showError('Lỗi tạo tài khoản admin: ' + error.message);
    }
}

async function deleteAdminUser(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản admin này?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        await loadAdminUsers();
        showSuccess('Xóa tài khoản admin thành công!');
        
    } catch (error) {
        console.error('Delete admin user error:', error);
        showError('Lỗi xóa tài khoản admin');
    }
}

// Settings Functions
async function loadSettings() {
    try {
        const settings = await getSettings();
        
        // Populate settings forms
        if (settings.contact_info) {
            document.getElementById('site-phone').value = settings.contact_info.phone || '';
            document.getElementById('site-email').value = settings.contact_info.email || '';
            document.getElementById('site-address').value = settings.contact_info.address || '';
        }
        
        if (settings.bank_info) {
            document.getElementById('bank-name').value = settings.bank_info.bank || '';
            document.getElementById('account-number').value = settings.bank_info.account_number || '';
            document.getElementById('account-name').value = settings.bank_info.account_name || '';
        }
        
        if (settings.support_hours) {
            document.getElementById('support-weekday').value = settings.support_hours.weekdays || '';
            document.getElementById('support-weekend').value = settings.support_hours.weekend || '';
        }
        
    } catch (error) {
        console.error('Load settings error:', error);
        showError('Lỗi tải cài đặt');
    }
}

async function handleGeneralSettings(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const contactInfo = {
            phone: formData.get('site-phone'),
            email: formData.get('site-email'),
            address: formData.get('site-address')
        };
        
        await updateSetting('contact_info', contactInfo);
        
        showSuccess('Cập nhật thông tin liên hệ thành công!');
        
    } catch (error) {
        console.error('Update general settings error:', error);
        showError('Lỗi cập nhật thông tin liên hệ');
    }
}

async function handleBankInfo(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const bankInfo = {
            bank: formData.get('bank-name'),
            account_number: formData.get('account-number'),
            account_name: formData.get('account-name')
        };
        
        await updateSetting('bank_info', bankInfo);
        
        showSuccess('Cập nhật thông tin ngân hàng thành công!');
        
    } catch (error) {
        console.error('Update bank info error:', error);
        showError('Lỗi cập nhật thông tin ngân hàng');
    }
}

async function handleSupportInfo(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const supportHours = {
            weekdays: formData.get('support-weekday'),
            weekend: formData.get('support-weekend')
        };
        
        await updateSetting('support_hours', supportHours);
        
        showSuccess('Cập nhật giờ hỗ trợ thành công!');
        
    } catch (error) {
        console.error('Update support info error:', error);
        showError('Lỗi cập nhật giờ hỗ trợ');
    }
}

// Banner Management Functions
async function updateBannerImage(bannerId) {
    const imageUrl = document.getElementById(`banner-${bannerId}-url`).value;
    
    if (!imageUrl) {
        alert('Vui lòng nhập URL hình ảnh!');
        return;
    }
    
    try {
        await updateBanner(bannerId, { image_url: imageUrl });
        
        // Update preview
        document.getElementById(`banner-${bannerId}-preview`).src = imageUrl;
        
        showSuccess('Cập nhật banner thành công!');
        
    } catch (error) {
        console.error('Update banner error:', error);
        showError('Lỗi cập nhật banner');
    }
}

// Category Management Functions
async function updateCategoryImage(categoryId) {
    const imageUrl = document.getElementById(`category-${categoryId}-url`).value;
    
    if (!imageUrl) {
        alert('Vui lòng nhập URL hình ảnh!');
        return;
    }
    
    try {
        await updateCategory(categoryId, { image_url: imageUrl });
        
        // Update preview
        document.getElementById(`category-${categoryId}-preview`).src = imageUrl;
        
        showSuccess('Cập nhật hình ảnh danh mục thành công!');
        
    } catch (error) {
        console.error('Update category error:', error);
        showError('Lỗi cập nhật hình ảnh danh mục');
    }
}

// Navigation Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update active menu item
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.parentElement.classList.add('active');
    
    adminState.currentSection = sectionName;
    
    // Load data for the section
    switch (sectionName) {
        case 'products':
            loadProducts();
            loadCategories().then(categories => populateCategoryFilter(categories));
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'admin-accounts':
            loadAdminUsers();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

async function loadCategories() {
    try {
        const categories = await getCategories();
        return categories;
    } catch (error) {
        console.error('Load categories error:', error);
        return [];
    }
}

function populateCategoryFilter(categories) {
    const select = document.getElementById('product-category-filter');
    const addProductSelect = document.getElementById('productCategory');
    
    if (select) {
        select.innerHTML = '<option value="">Tất cả danh mục</option>';
        categories.forEach(category => {
            select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    }
    
    if (addProductSelect) {
        addProductSelect.innerHTML = '<option value="">Chọn danh mục</option>';
        categories.forEach(category => {
            addProductSelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    }
}

// Profile Functions
function showProfile() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Populate profile data
        if (adminState.currentUser) {
            document.getElementById('profile-name').value = adminState.currentUser.full_name || '';
            document.getElementById('profile-email').value = adminState.currentUser.email || '';
            document.getElementById('profile-phone').value = adminState.currentUser.phone || '';
        }
    }
}

function closeProfile() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function updateProfile() {
    const name = document.getElementById('profile-name').value;
    const phone = document.getElementById('profile-phone').value;
    
    try {
        const { error } = await supabase
            .from('users')
            .update({
                full_name: name,
                phone: phone
            })
            .eq('id', adminState.currentUser.id);
        
        if (error) throw error;
        
        // Update local state
        adminState.currentUser.full_name = name;
        adminState.currentUser.phone = phone;
        
        // Update display
        document.getElementById('admin-name').textContent = name;
        
        closeProfile();
        showSuccess('Cập nhật hồ sơ thành công!');
        
    } catch (error) {
        console.error('Update profile error:', error);
        showError('Lỗi cập nhật hồ sơ');
    }
}

async function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        try {
            await logoutUser();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
            showError('Lỗi đăng xuất');
        }
    }
}

// Utility Functions
function showLoading() {
    adminState.isLoading = true;
    // Show loading indicator
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) loadingEl.style.display = 'block';
}

function hideLoading() {
    adminState.isLoading = false;
    // Hide loading indicator
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) loadingEl.style.display = 'none';
}

function showSuccess(message) {
    // You can implement a toast notification here
    alert(message);
}

function showError(message) {
    // You can implement a toast notification here
    alert(message);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadge(status) {
    const statusMap = {
        'active': '<span class="badge badge-success">Hoạt động</span>',
        'inactive': '<span class="badge badge-secondary">Ngừng hoạt động</span>',
        'pending': '<span class="badge badge-warning">Chờ xử lý</span>',
        'confirmed': '<span class="badge badge-info">Đã xác nhận</span>',
        'shipping': '<span class="badge badge-primary">Đang giao</span>',
        'delivered': '<span class="badge badge-success">Đã giao</span>',
        'cancelled': '<span class="badge badge-danger">Đã hủy</span>',
        'out_of_stock': '<span class="badge badge-warning">Hết hàng</span>'
    };
    
    return statusMap[status] || `<span class="badge badge-secondary">${status}</span>`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search and Filter Functions
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value;
    adminState.filters.products.search = searchTerm;
    adminState.pagination.products.page = 1;
    loadProducts();
}

function filterProducts() {
    const category = document.getElementById('product-category-filter').value;
    const status = document.getElementById('product-status-filter').value;
    
    adminState.filters.products.category = category;
    adminState.filters.products.status = status;
    adminState.pagination.products.page = 1;
    
    loadProducts();
}

function searchOrders() {
    const searchTerm = document.getElementById('order-search').value;
    adminState.filters.orders.search = searchTerm;
    adminState.pagination.orders.page = 1;
    loadOrders();
}

function filterOrders() {
    const status = document.getElementById('order-status-filter').value;
    adminState.filters.orders.status = status;
    adminState.pagination.orders.page = 1;
    loadOrders();
}

function searchUsers() {
    const searchTerm = document.getElementById('user-search').value;
    adminState.filters.users.search = searchTerm;
    adminState.pagination.users.page = 1;
    loadUsers();
}

function filterUsers() {
    const status = document.getElementById('user-status-filter').value;
    adminState.filters.users.status = status;
    adminState.pagination.users.page = 1;
    loadUsers();
}

// Modal Functions
function showEditProductModal(product) {
    // Implementation for edit product modal
    console.log('Edit product:', product);
}

function showOrderDetailsModal(order) {
    // Implementation for order details modal
    console.log('Order details:', order);
}

// Image preview function for product form
function previewProductImage() {
    const imageUrl = document.getElementById('productImage').value;
    const preview = document.getElementById('product-image-preview');
    
    if (imageUrl && preview) {
        preview.src = imageUrl;
        preview.style.display = 'block';
    }
}
