// Main JavaScript for SportZone

// Global state management
const state = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    currentCategory: 'all',
    searchQuery: ''
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    loadProducts();
    updateCartCount();
    updateWishlistCount();
    setupEventListeners();
    
    // Load featured products on homepage
    if (document.getElementById('products-grid')) {
        loadFeaturedProducts();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Category clicks
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Modal events
    setupModalEvents();
    
    // Cart events
    setupCartEvents();
    
    // Form submissions
    setupFormEvents();
}

// Product loading and display
function loadProducts(categoryFilter = null, searchFilter = null) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    let filteredProducts = products;
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchFilter) {
        filteredProducts = filteredProducts.filter(product => 
            getProductName(product).toLowerCase().includes(searchFilter.toLowerCase()) ||
            getProductDescription(product).toLowerCase().includes(searchFilter.toLowerCase())
        );
    }
    
    // Display products
    displayProducts(filteredProducts, productsGrid);
}

function loadFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        displayProducts(featuredProducts, productsGrid);
    }
}

function displayProducts(productList, container) {
    if (productList.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p>${getText('no_products_found') || 'Không tìm thấy sản phẩm nào'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productList.map(product => createProductCard(product)).join('');
    
    // Add event listeners to new product cards
    addProductEventListeners();
}

function createProductCard(product) {
    const isOutOfStock = product.stock === 0;
    const hasDiscount = product.discount > 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${getProductName(product)}">
                
                ${product.onSale ? `<div class="product-badge sale">${getText('sale')}</div>` : ''}
                ${product.isNew ? `<div class="product-badge new">${getText('new')}</div>` : ''}
                ${product.featured ? `<div class="product-badge hot">${getText('hot')}</div>` : ''}
                
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart ${isInWishlist(product.id) ? 'text-red' : ''}"></i>
                    </button>
                    <button class="action-btn share-btn" onclick="shareProduct(${product.id})">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-btn view-btn" onclick="quickViewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            
            <div class="product-info">
                <h3 class="product-title">${getProductName(product)}</h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${formatCurrency(hasDiscount ? product.salePrice : product.originalPrice)}</span>
                    ${hasDiscount ? `
                        <span class="original-price">${formatCurrency(product.originalPrice)}</span>
                        <span class="discount">-${product.discount}%</span>
                    ` : ''}
                </div>
                
                <div class="product-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}">
                    ${isOutOfStock ? getText('out_of_stock') : getText('in_stock') + ': ' + product.stock}
                </div>
                
                <button class="add-to-cart" 
                        onclick="addToCart(${product.id})" 
                        ${isOutOfStock ? 'disabled' : ''}>
                    ${getText('add_to_cart')}
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function addProductEventListeners() {
    // Add any additional event listeners for product cards if needed
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const query = searchInput.value.trim();
    
    if (query) {
        state.searchQuery = query;
        loadProducts(state.currentCategory, query);
    } else {
        state.searchQuery = '';
        loadProducts(state.currentCategory);
    }
}

function filterByCategory(category) {
    state.currentCategory = category;
    loadProducts(category, state.searchQuery);
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        showMessage(getText('out_of_stock'), 'error');
        return;
    }
    
    const existingItem = state.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            showMessage(getText('insufficient_stock') || 'Không đủ hàng trong kho', 'warning');
            return;
        }
    } else {
        state.cart.push({
            productId: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showMessage(getText('added_to_cart'), 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showMessage(getText('removed_from_cart'), 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    const cartItem = state.cart.find(item => item.productId === productId);
    
    if (!cartItem || !product) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showMessage(getText('insufficient_stock') || 'Không đủ hàng trong kho', 'warning');
        return;
    }
    
    cartItem.quantity = newQuantity;
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartCount() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>${getText('cart_empty')}</p>
                <button class="btn-primary" onclick="toggleCart()">${getText('continue_shopping')}</button>
            </div>
        `;
        cartTotal.textContent = formatCurrency(0);
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = state.cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const itemPrice = product.onSale ? product.salePrice : product.originalPrice;
        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${product.images[0]}" alt="${getProductName(product)}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${getProductName(product)}</div>
                    <div class="cart-item-price">${formatCurrency(itemPrice)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${product.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${product.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = formatCurrency(total);
}

function setupCartEvents() {
    // Close cart when clicking overlay
    document.getElementById('overlay').addEventListener('click', function() {
        toggleCart();
    });
}

// Wishlist functionality
function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    
    if (index === -1) {
        state.wishlist.push(productId);
        showMessage(getText('added_to_wishlist'), 'success');
    } else {
        state.wishlist.splice(index, 1);
        showMessage(getText('removed_from_wishlist') || 'Đã xóa khỏi yêu thích', 'info');
    }
    
    saveWishlist();
    updateWishlistCount();
    updateWishlistButtons();
}

function isInWishlist(productId) {
    return state.wishlist.includes(productId);
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
}

function updateWishlistCount() {
    const wishlistCountElements = document.querySelectorAll('.wishlist-icon .count');
    wishlistCountElements.forEach(element => {
        element.textContent = state.wishlist.length;
    });
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn i').forEach(icon => {
        const productCard = icon.closest('.product-card');
        if (productCard) {
            const productId = parseInt(productCard.getAttribute('data-product-id'));
            if (isInWishlist(productId)) {
                icon.style.color = '#dc3545';
            } else {
                icon.style.color = '';
            }
        }
    });
}

// Product actions
function shareProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (navigator.share) {
        navigator.share({
            title: getProductName(product),
            text: getProductDescription(product),
            url: window.location.href + '#product-' + productId
        });
    } else {
        // Fallback - copy to clipboard
        const url = window.location.href + '#product-' + productId;
        navigator.clipboard.writeText(url).then(() => {
            showMessage(getText('link_copied') || 'Đã sao chép liên kết', 'success');
        });
    }
}

function quickViewProduct(productId) {
    // Implement quick view modal
    console.log('Quick view product:', productId);
    // This would open a modal with product details
}

// Modal functionality
function setupModalEvents() {
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

function showLogin() {
    document.getElementById('login-modal').style.display = 'block';
    closeModal('register-modal');
}

function showRegister() {
    document.getElementById('register-modal').style.display = 'block';
    closeModal('login-modal');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Form handling
function setupFormEvents() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
    
    // Mock login - in real app, this would call an API
    if (email && password) {
        const user = {
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            loginAt: new Date().toISOString()
        };
        
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        
        closeModal('login-modal');
        showMessage(getText('login_success'), 'success');
        updateUserDisplay();
    } else {
        showMessage(getText('error_occurred'), 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    let allValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allValid = false;
        }
    });
    
    if (allValid) {
        // Mock registration
        const user = {
            id: 'user_' + Date.now(),
            name: inputs[0].value,
            email: inputs[1].value,
            phone: inputs[3].value,
            registeredAt: new Date().toISOString()
        };
        
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        
        closeModal('register-modal');
        showMessage(getText('register_success'), 'success');
        updateUserDisplay();
    } else {
        showMessage(getText('error_occurred'), 'error');
    }
}

function updateUserDisplay() {
    // Update user menu display
    const userMenu = document.querySelector('.user-menu .dropdown');
    if (state.user && userMenu) {
        userMenu.innerHTML = `
            <a href="#" onclick="showProfile()">${state.user.name}</a>
            <a href="#" onclick="showOrders()">${getText('my_orders') || 'Đơn hàng của tôi'}</a>
            <a href="#" onclick="logout()">${getText('logout')}</a>
        `;
    }
}

function logout() {
    state.user = null;
    localStorage.removeItem('user');
    showMessage(getText('logout_success') || 'Đăng xuất thành công', 'info');
    updateUserDisplay();
}

// Utility functions
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} show`;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
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
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.toggleWishlist = toggleWishlist;
window.shareProduct = shareProduct;
window.quickViewProduct = quickViewProduct;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.closeModal = closeModal;
window.logout = logout;
window.filterByCategory = filterByCategory;