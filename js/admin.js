// Admin JavaScript for SportZone

// Admin state management
const adminState = {
    currentSection: 'dashboard',
    currentUser: {
        id: 'ADMIN001',
        name: 'Super Admin',
        role: 'super_admin'
    },
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
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadDashboard();
    setupEventListeners();
});

function initializeAdmin() {
    // Set admin name
    document.getElementById('admin-name').textContent = adminState.currentUser.name;
    
    // Show dashboard by default
    showSection('dashboard');
}

function setupEventListeners() {
    // Form submissions
    document.getElementById('add-product-form')?.addEventListener('submit', handleAddProduct);
    document.getElementById('add-admin-form')?.addEventListener('submit', handleAddAdmin);
    document.getElementById('general-settings-form')?.addEventListener('submit', handleGeneralSettings);
    document.getElementById('bank-info-form')?.addEventListener('submit', handleBankInfo);
    document.getElementById('support-info-form')?.addEventListener('submit', handleSupportInfo);
    
    // Search inputs
    document.getElementById('product-search')?.addEventListener('keyup', debounce(searchProducts, 300));
    document.getElementById('order-search')?.addEventListener('keyup', debounce(searchOrders, 300));
    document.getElementById('user-search')?.addEventListener('keyup', debounce(searchUsers, 300));
}

// Section Management
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).closest('.nav-item').classList.add('active');
    
    adminState.currentSection = sectionName;
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'admins':
            loadAdmins();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const main = document.querySelector('.admin-main');
    
    sidebar.classList.toggle('show');
    main.classList.toggle('expanded');
}

// Dashboard Functions
function loadDashboard() {
    updateStatsCards();
    createCharts();
    loadTopProducts();
}

function updateDashboard() {
    const timeRange = document.getElementById('time-range').value;
    // In real app, this would fetch data based on time range
    updateStatsCards();
    updateCharts();
}

function updateStatsCards() {
    const stats = salesStats.thisMonth;
    
    document.getElementById('total-revenue').textContent = formatCurrency(stats.revenue);
    document.getElementById('total-orders').textContent = stats.orders;
    document.getElementById('total-customers').textContent = stats.customers;
    document.getElementById('revenue-change').textContent = `+${stats.growthRevenue}%`;
    document.getElementById('orders-change').textContent = `+${stats.growthOrders}%`;
    document.getElementById('customers-change').textContent = `+${stats.growthCustomers}%`;
}

function createCharts() {
    createRevenueChart();
    createOrdersChart();
    createCategoryChart();
}

function createRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: salesStats.dailyRevenue,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createOrdersChart() {
    const ctx = document.getElementById('orders-chart');
    if (!ctx) return;
    
    // Generate sample orders data
    const ordersData = salesStats.dailyRevenue.map(() => Math.floor(Math.random() * 10) + 1);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: 'Đơn hàng',
                data: ordersData,
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createCategoryChart() {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    
    const categoryData = salesStats.categoryDistribution;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.map(item => getCategoryName(categories.find(c => c.id === item.category))),
            datasets: [{
                data: categoryData.map(item => item.percentage),
                backgroundColor: [
                    '#007bff',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6f42c1'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function loadTopProducts() {
    const container = document.getElementById('top-products-list');
    if (!container) return;
    
    container.innerHTML = salesStats.topProducts.map(product => `
        <div class="top-product-item">
            <div>
                <div class="product-name">${product.name}</div>
                <div class="product-sales">Bán: ${product.sales} sản phẩm</div>
            </div>
            <div class="product-revenue">${formatCurrency(product.revenue)}</div>
        </div>
    `).join('');
}

function updateCharts() {
    // This would update existing charts with new data
    Chart.getChart('revenue-chart')?.destroy();
    Chart.getChart('orders-chart')?.destroy();
    Chart.getChart('category-chart')?.destroy();
    createCharts();
}

// Product Management
function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    let filteredProducts = [...products];
    
    // Apply filters
    const filters = adminState.filters.products;
    if (filters.search) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.category) {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    if (filters.status) {
        filteredProducts = filteredProducts.filter(product => {
            if (filters.status === 'out_of_stock') return product.stock === 0;
            return true; // Add more status filtering logic
        });
    }
    
    // Pagination
    const { page, limit } = adminState.pagination.products;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
    tbody.innerHTML = paginatedProducts.map(product => `
        <tr>
            <td><input type="checkbox" value="${product.id}"></td>
            <td><img src="${product.images[0]}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(categories.find(c => c.id === product.category))}</td>
            <td>${formatCurrency(product.onSale ? product.salePrice : product.originalPrice)}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">
                ${product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
            </span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination('products', filteredProducts.length);
}

function searchProducts() {
    const searchValue = document.getElementById('product-search').value;
    adminState.filters.products.search = searchValue;
    adminState.pagination.products.page = 1;
    loadProducts();
}

function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    adminState.filters.products.category = categoryFilter;
    adminState.filters.products.status = statusFilter;
    adminState.pagination.products.page = 1;
    loadProducts();
}

function clearProductFilters() {
    document.getElementById('product-search').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('status-filter').value = '';
    
    adminState.filters.products = { search: '', category: '', status: '' };
    adminState.pagination.products.page = 1;
    loadProducts();
}

function showAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'block';
}

function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Mock product creation
    const newProduct = {
        id: products.length + 1,
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        originalPrice: parseInt(formData.get('originalPrice')),
        salePrice: parseInt(formData.get('salePrice')),
        stock: parseInt(formData.get('stock')),
        featured: formData.get('featured') === 'on',
        onSale: formData.get('onSale') === 'on',
        images: ['https://via.placeholder.com/300x300/007bff/ffffff?text=New+Product'],
        rating: 0,
        reviews: 0
    };
    
    products.push(newProduct);
    loadProducts();
    closeAdminModal('add-product-modal');
    showAdminMessage('Sản phẩm đã được thêm thành công', 'success');
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Chi tiết sản phẩm: ${product.name}`);
    }
}

function editProduct(productId) {
    alert(`Chỉnh sửa sản phẩm ID: ${productId}`);
}

function deleteProduct(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            loadProducts();
            showAdminMessage('Sản phẩm đã được xóa', 'success');
        }
    }
}

// Order Management
function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    
    let filteredOrders = [...orders];
    
    // Apply filters
    const filters = adminState.filters.orders;
    if (filters.search) {
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.customerName.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.status) {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    // Pagination
    const { page, limit } = adminState.pagination.orders;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
    
    tbody.innerHTML = paginatedOrders.map(order => `
        <tr>
            <td><input type="checkbox" value="${order.id}"></td>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${formatCurrency(order.total)}</td>
            <td><span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewOrderDetail('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteOrder('${order.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination('orders', filteredOrders.length);
}

function searchOrders() {
    const searchValue = document.getElementById('order-search').value;
    adminState.filters.orders.search = searchValue;
    adminState.pagination.orders.page = 1;
    loadOrders();
}

function filterOrders() {
    const statusFilter = document.getElementById('order-status-filter').value;
    adminState.filters.orders.status = statusFilter;
    adminState.pagination.orders.page = 1;
    loadOrders();
}

function clearOrderFilters() {
    document.getElementById('order-search').value = '';
    document.getElementById('order-status-filter').value = '';
    
    adminState.filters.orders = { search: '', status: '' };
    adminState.pagination.orders.page = 1;
    loadOrders();
}

function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const content = document.getElementById('order-detail-content');
    content.innerHTML = `
        <div class="order-detail">
            <div class="order-info">
                <h3>Thông tin đơn hàng</h3>
                <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
                <p><strong>Khách hàng:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>SĐT:</strong> ${order.customerPhone}</p>
                <p><strong>Trạng thái:</strong> <span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></p>
                <p><strong>Ngày đặt:</strong> ${formatDate(order.createdAt)}</p>
            </div>
            
            <div class="shipping-info">
                <h3>Thông tin giao hàng</h3>
                <p><strong>Người nhận:</strong> ${order.shippingAddress.fullName}</p>
                <p><strong>SĐT:</strong> ${order.shippingAddress.phone}</p>
                <p><strong>Địa chỉ:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}</p>
            </div>
            
            <div class="order-items">
                <h3>Sản phẩm</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="order-summary">
                <h3>Tóm tắt đơn hàng</h3>
                <p><strong>Tạm tính:</strong> ${formatCurrency(order.subtotal)}</p>
                <p><strong>Phí vận chuyển:</strong> ${formatCurrency(order.shippingFee)}</p>
                <p><strong>Tổng cộng:</strong> ${formatCurrency(order.total)}</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</p>
            </div>
            
            <div class="order-actions">
                <h3>Xác nhận trạng thái đơn hàng</h3>
                <select id="order-status-update">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Xác nhận</option>
                    <option value="shipping" ${order.status === 'shipping' ? 'selected' : ''}>Đang giao</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Đã giao</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                </select>
                <button class="btn-primary" onclick="updateOrderStatus('${order.id}')">
                    Cập nhật trạng thái
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('order-detail-modal').style.display = 'block';
}

function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('order-status-update').value;
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        loadOrders();
        closeAdminModal('order-detail-modal');
        showAdminMessage('Trạng thái đơn hàng đã được cập nhật', 'success');
    }
}

function editOrder(orderId) {
    alert(`Chỉnh sửa đơn hàng ID: ${orderId}`);
}

function deleteOrder(orderId) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders.splice(index, 1);
            loadOrders();
            showAdminMessage('Đơn hàng đã được xóa', 'success');
        }
    }
}

function exportOrders() {
    // Mock export functionality
    showAdminMessage('Xuất file Excel thành công', 'success');
}

// User Management
function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    let filteredUsers = [...customers];
    
    // Apply filters
    const filters = adminState.filters.users;
    if (filters.search) {
        filteredUsers = filteredUsers.filter(user => 
            user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    
    // Pagination
    const { page, limit } = adminState.pagination.users;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
    
    tbody.innerHTML = paginatedUsers.map(user => `
        <tr>
            <td><input type="checkbox" value="${user.id}"></td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${formatDate(user.registeredAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewUser('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination('users', filteredUsers.length);
}

function searchUsers() {
    const searchValue = document.getElementById('user-search').value;
    adminState.filters.users.search = searchValue;
    adminState.pagination.users.page = 1;
    loadUsers();
}

function filterUsers() {
    const statusFilter = document.getElementById('user-status-filter').value;
    adminState.filters.users.status = statusFilter;
    adminState.pagination.users.page = 1;
    loadUsers();
}

function clearUserFilters() {
    document.getElementById('user-search').value = '';
    document.getElementById('user-status-filter').value = '';
    
    adminState.filters.users = { search: '', status: '' };
    adminState.pagination.users.page = 1;
    loadUsers();
}

function viewUser(userId) {
    const user = customers.find(u => u.id === userId);
    if (user) {
        alert(`Chi tiết người dùng: ${user.fullName}\nEmail: ${user.email}\nSĐT: ${user.phone}`);
    }
}

function deleteUser(userId) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        const index = customers.findIndex(u => u.id === userId);
        if (index !== -1) {
            customers.splice(index, 1);
            loadUsers();
            showAdminMessage('Người dùng đã được xóa', 'success');
        }
    }
}

function exportUsers() {
    showAdminMessage('Xuất file Excel thành công', 'success');
}

// Admin Management
function loadAdmins() {
    const tbody = document.getElementById('admins-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = adminUsers.map(admin => `
        <tr>
            <td>${admin.email}</td>
            <td>${admin.fullName}</td>
            <td><span class="status-badge active">${getRoleText(admin.role)}</span></td>
            <td>${formatDate(admin.createdAt)}</td>
            <td>${formatDate(admin.lastLogin)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editAdmin('${admin.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${admin.role !== 'super_admin' ? `
                        <button class="action-btn delete" onclick="deleteAdmin('${admin.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddAdminModal() {
    document.getElementById('add-admin-modal').style.display = 'block';
}

function handleAddAdmin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newAdmin = {
        id: 'ADMIN' + String(adminUsers.length + 1).padStart(3, '0'),
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        role: formData.get('role'),
        createdAt: new Date().toISOString(),
        lastLogin: null,
        status: 'active'
    };
    
    adminUsers.push(newAdmin);
    loadAdmins();
    closeAdminModal('add-admin-modal');
    showAdminMessage('Admin đã được thêm thành công', 'success');
}

function editAdmin(adminId) {
    alert(`Chỉnh sửa admin ID: ${adminId}`);
}

function deleteAdmin(adminId) {
    if (confirm('Bạn có chắc chắn muốn xóa admin này?')) {
        const index = adminUsers.findIndex(a => a.id === adminId);
        if (index !== -1) {
            adminUsers.splice(index, 1);
            loadAdmins();
            showAdminMessage('Admin đã được xóa', 'success');
        }
    }
}

// Settings Management
function loadSettings() {
    loadShippingFees();
    loadGeneralSettings();
    loadBankInfo();
    loadSupportInfo();
    loadCategoryImages();
}

function loadShippingFees() {
    const container = document.getElementById('shipping-fees-list');
    if (!container) return;
    
    container.innerHTML = Object.entries(shippingFees).map(([province, fee]) => `
        <div class="shipping-fee-item">
            <span>${province}</span>
            <span>${formatCurrency(fee)}</span>
            <button class="action-btn delete" onclick="deleteShippingFee('${province}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function loadGeneralSettings() {
    document.getElementById('free-shipping-threshold').value = systemSettings.freeShippingThreshold;
}

function loadBankInfo() {
    const bankInfo = systemSettings.bankInfo;
    document.getElementById('bank-name').value = bankInfo.bankName;
    document.getElementById('account-number').value = bankInfo.accountNumber;
    document.getElementById('account-name').value = bankInfo.accountName;
    document.getElementById('bank-branch').value = bankInfo.branch;
}

function loadSupportInfo() {
    const supportInfo = systemSettings.supportInfo;
    document.getElementById('support-hotline').value = supportInfo.hotline;
    document.getElementById('support-email').value = supportInfo.email;
    document.getElementById('working-hours').value = supportInfo.workingHours;
}

function loadCategoryImages() {
    const container = document.getElementById('category-images-list');
    if (!container) return;
    
    container.innerHTML = categories.map(category => `
        <div class="category-image-item">
            <img src="${category.image}" alt="${category.name}">
            <h4>${category.name}</h4>
            <button class="btn-secondary" onclick="changeCategoryImage('${category.id}')">
                Đổi ảnh
            </button>
        </div>
    `).join('');
}

function handleGeneralSettings(e) {
    e.preventDefault();
    const threshold = document.getElementById('free-shipping-threshold').value;
    systemSettings.freeShippingThreshold = parseInt(threshold);
    showAdminMessage('Cài đặt chung đã được lưu', 'success');
}

function handleBankInfo(e) {
    e.preventDefault();
    systemSettings.bankInfo = {
        bankName: document.getElementById('bank-name').value,
        accountNumber: document.getElementById('account-number').value,
        accountName: document.getElementById('account-name').value,
        branch: document.getElementById('bank-branch').value
    };
    showAdminMessage('Thông tin ngân hàng đã được lưu', 'success');
}

function handleSupportInfo(e) {
    e.preventDefault();
    systemSettings.supportInfo = {
        hotline: document.getElementById('support-hotline').value,
        email: document.getElementById('support-email').value,
        workingHours: document.getElementById('working-hours').value
    };
    showAdminMessage('Thông tin hỗ trợ đã được lưu', 'success');
}

function showAddShippingFeeModal() {
    const province = prompt('Nhập tên tỉnh/thành phố:');
    const fee = prompt('Nhập phí vận chuyển (VNĐ):');
    
    if (province && fee) {
        shippingFees[province] = parseInt(fee);
        loadShippingFees();
        showAdminMessage('Phí vận chuyển đã được thêm', 'success');
    }
}

function deleteShippingFee(province) {
    if (confirm(`Xóa phí vận chuyển cho ${province}?`)) {
        delete shippingFees[province];
        loadShippingFees();
        showAdminMessage('Phí vận chuyển đã được xóa', 'success');
    }
}

function changeCategoryImage(categoryId) {
    alert(`Đổi ảnh cho danh mục: ${categoryId}`);
}

// Utility Functions
function updatePagination(type, totalItems) {
    const container = document.getElementById(`${type}-pagination`);
    if (!container) return;
    
    const { page, limit } = adminState.pagination[type];
    const totalPages = Math.ceil(totalItems / limit);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (page > 1) {
        paginationHTML += `<a href="#" class="page-btn" onclick="changePage('${type}', ${page - 1})">&laquo;</a>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === page) {
            paginationHTML += `<a href="#" class="page-btn active">${i}</a>`;
        } else {
            paginationHTML += `<a href="#" class="page-btn" onclick="changePage('${type}', ${i})">${i}</a>`;
        }
    }
    
    // Next button
    if (page < totalPages) {
        paginationHTML += `<a href="#" class="page-btn" onclick="changePage('${type}', ${page + 1})">&raquo;</a>`;
    }
    
    container.innerHTML = paginationHTML;
}

function changePage(type, newPage) {
    adminState.pagination[type].page = newPage;
    
    switch(type) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

function selectAllProducts(checkbox) {
    const checkboxes = document.querySelectorAll('#products-table-body input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

function selectAllOrders(checkbox) {
    const checkboxes = document.querySelectorAll('#orders-table-body input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

function selectAllUsers(checkbox) {
    const checkboxes = document.querySelectorAll('#users-table-body input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

function closeAdminModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAdminMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} show`;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

function showProfile() {
    // Create and show profile modal
    const modalHtml = `
        <div id="profile-modal" class="admin-modal" style="display: block;">
            <div class="modal-content">
                <span class="close" onclick="closeAdminModal('profile-modal')">&times;</span>
                <h2>Hồ sơ Admin</h2>
                <form id="profile-form">
                    <div class="form-group">
                        <label>Họ và tên</label>
                        <input type="text" value="${adminState.currentUser.name}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="admin@sportzone.com" readonly>
                    </div>
                    <div class="form-group">
                        <label>Vai trò</label>
                        <input type="text" value="${getRoleText(adminState.currentUser.role)}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Mật khẩu mới (để trống nếu không đổi)</label>
                        <input type="password" placeholder="Nhập mật khẩu mới">
                    </div>
                    <div class="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" placeholder="Xác nhận mật khẩu mới">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Cập nhật</button>
                        <button type="button" class="btn-secondary" onclick="closeAdminModal('profile-modal')">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('profile-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Setup form handler
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showMessage('Hồ sơ đã được cập nhật!', 'success');
        closeAdminModal('profile-modal');
    });
}

function adminLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Clear any admin session data
        localStorage.removeItem('adminSession');
        window.location.href = 'index.html';
    }
}

// Helper Functions
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function generateDateLabels(days) {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
    }
    return labels;
}

function getOrderStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'confirmed': 'Xác nhận',
        'shipping': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function getRoleText(role) {
    const roleMap = {
        'super_admin': 'Super Admin',
        'admin': 'Admin',
        'staff': 'Nhân viên'
    };
    return roleMap[role] || role;
}

function getCategoryName(category) {
    return category ? category.name : 'Không xác định';
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

// Export functions for global use
window.showSection = showSection;
window.toggleSidebar = toggleSidebar;
window.updateDashboard = updateDashboard;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.clearProductFilters = clearProductFilters;
window.showAddProductModal = showAddProductModal;
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.searchOrders = searchOrders;
window.filterOrders = filterOrders;
window.clearOrderFilters = clearOrderFilters;
window.viewOrderDetail = viewOrderDetail;
window.updateOrderStatus = updateOrderStatus;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.exportOrders = exportOrders;
window.searchUsers = searchUsers;
window.filterUsers = filterUsers;
window.clearUserFilters = clearUserFilters;
window.viewUser = viewUser;
window.deleteUser = deleteUser;
window.exportUsers = exportUsers;
window.showAddAdminModal = showAddAdminModal;
window.editAdmin = editAdmin;
window.deleteAdmin = deleteAdmin;
window.showAddShippingFeeModal = showAddShippingFeeModal;
window.deleteShippingFee = deleteShippingFee;
window.changeCategoryImage = changeCategoryImage;
window.selectAllProducts = selectAllProducts;
window.selectAllOrders = selectAllOrders;
window.selectAllUsers = selectAllUsers;
window.changePage = changePage;
window.closeAdminModal = closeAdminModal;
window.showProfile = showProfile;
window.adminLogout = adminLogout;
