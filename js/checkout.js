// Checkout JavaScript for SportZone

// State management
const checkoutState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    selectedProvince: '',
    selectedDistrict: '',
    selectedWard: '',
    shippingFee: 0,
    discount: 0,
    couponCode: ''
};

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadProvinces();
    loadCheckoutItems();
    calculateTotal();
    setupEventListeners();
    
    // Redirect if cart is empty
    if (checkoutState.cart.length === 0) {
        alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        window.location.href = 'index.html';
        return;
    }
});

function setupEventListeners() {
    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Form validation
    document.getElementById('customer-form').addEventListener('input', validateForms);
    document.getElementById('shipping-form').addEventListener('input', validateForms);
}

// Load address data
function loadProvinces() {
    const provinceSelect = document.getElementById('province-select');
    
    Object.keys(vietnamAddress).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
}

function loadDistricts() {
    const provinceSelect = document.getElementById('province-select');
    const districtSelect = document.getElementById('district-select');
    const wardSelect = document.getElementById('ward-select');
    
    const selectedProvince = provinceSelect.value;
    checkoutState.selectedProvince = selectedProvince;
    
    // Clear districts and wards
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
    
    if (selectedProvince && vietnamAddress[selectedProvince]) {
        Object.keys(vietnamAddress[selectedProvince]).forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
    
    updateShippingFee();
}

function loadWards() {
    const provinceSelect = document.getElementById('province-select');
    const districtSelect = document.getElementById('district-select');
    const wardSelect = document.getElementById('ward-select');
    
    const selectedProvince = provinceSelect.value;
    const selectedDistrict = districtSelect.value;
    checkoutState.selectedDistrict = selectedDistrict;
    
    // Clear wards
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
    
    if (selectedProvince && selectedDistrict && vietnamAddress[selectedProvince][selectedDistrict]) {
        vietnamAddress[selectedProvince][selectedDistrict].forEach(ward => {
            const option = document.createElement('option');
            option.value = ward;
            option.textContent = ward;
            wardSelect.appendChild(option);
        });
    }
}

function updateShippingFee() {
    const province = checkoutState.selectedProvince;
    const subtotal = calculateSubtotal();
    
    // Check free shipping threshold
    if (subtotal >= systemSettings.freeShippingThreshold) {
        checkoutState.shippingFee = 0;
    } else {
        checkoutState.shippingFee = shippingFees[province] || shippingFees['Default'];
    }
    
    updateShippingFeeDisplay();
    calculateTotal();
}

function updateShippingFeeDisplay() {
    const shippingFeeElement = document.getElementById('shipping-fee');
    if (checkoutState.shippingFee === 0) {
        shippingFeeElement.textContent = 'Miễn phí';
    } else {
        shippingFeeElement.textContent = formatCurrency(checkoutState.shippingFee);
    }
}

// Load cart items for checkout
function loadCheckoutItems() {
    const container = document.getElementById('checkout-items');
    
    if (checkoutState.cart.length === 0) {
        container.innerHTML = '<p>Giỏ hàng trống</p>';
        return;
    }
    
    container.innerHTML = checkoutState.cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const itemPrice = product.onSale ? product.salePrice : product.originalPrice;
        
        return `
            <div class="checkout-item">
                <img src="${product.images[0]}" alt="${product.name}" class="item-image">
                <div class="item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-details">Số lượng: ${item.quantity}</div>
                    <div class="item-price">${formatCurrency(itemPrice)} x ${item.quantity} = ${formatCurrency(itemPrice * item.quantity)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Calculate totals
function calculateSubtotal() {
    return checkoutState.cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return total;
        
        const itemPrice = product.onSale ? product.salePrice : product.originalPrice;
        return total + (itemPrice * item.quantity);
    }, 0);
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const total = subtotal + checkoutState.shippingFee - checkoutState.discount;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('total-amount').textContent = formatCurrency(total);
    
    // Update transfer content for bank payment
    document.getElementById('transfer-content').textContent = `SPORTZONE ${generateOrderId()}`;
}

// Payment method handling
function handlePaymentMethodChange(e) {
    const bankInfo = document.getElementById('bank-info');
    
    if (e.target.value === 'bank_transfer') {
        bankInfo.style.display = 'block';
    } else {
        bankInfo.style.display = 'none';
    }
}

// Coupon handling
function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
    
    // Mock coupon validation
    const validCoupons = {
        'SPORT10': 0.1,  // 10% discount
        'WELCOME20': 0.2, // 20% discount
        'SUMMER15': 0.15  // 15% discount
    };
    
    if (validCoupons[couponCode]) {
        const subtotal = calculateSubtotal();
        checkoutState.discount = subtotal * validCoupons[couponCode];
        checkoutState.couponCode = couponCode;
        
        // Show discount row
        const discountRow = document.getElementById('coupon-discount');
        discountRow.style.display = 'flex';
        discountRow.querySelector('span:last-child').textContent = '-' + formatCurrency(checkoutState.discount);
        
        calculateTotal();
        
        // Disable coupon input
        document.getElementById('coupon-code').disabled = true;
        
        showMessage(`Áp dụng mã giảm giá thành công! Giảm ${formatCurrency(checkoutState.discount)}`, 'success');
    } else {
        showMessage('Mã giảm giá không hợp lệ!', 'error');
    }
}

// Form validation
function validateForms() {
    const customerForm = document.getElementById('customer-form');
    const shippingForm = document.getElementById('shipping-form');
    const placeOrderBtn = document.querySelector('.btn-place-order');
    
    const customerValid = customerForm.checkValidity();
    const shippingValid = shippingForm.checkValidity();
    
    placeOrderBtn.disabled = !(customerValid && shippingValid);
}

// Place order
function placeOrder() {
    if (!validateOrderData()) {
        return;
    }
    
    const orderData = collectOrderData();
    
    // Simulate order processing
    document.querySelector('.btn-place-order').disabled = true;
    document.querySelector('.btn-place-order').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    
    setTimeout(() => {
        processOrder(orderData);
    }, 2000);
}

function validateOrderData() {
    const customerForm = document.getElementById('customer-form');
    const shippingForm = document.getElementById('shipping-form');
    
    if (!customerForm.checkValidity()) {
        showMessage('Vui lòng điền đầy đủ thông tin khách hàng!', 'error');
        return false;
    }
    
    if (!shippingForm.checkValidity()) {
        showMessage('Vui lòng điền đầy đủ địa chỉ giao hàng!', 'error');
        return false;
    }
    
    return true;
}

function collectOrderData() {
    const customerFormData = new FormData(document.getElementById('customer-form'));
    const shippingFormData = new FormData(document.getElementById('shipping-form'));
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const orderNotes = document.querySelector('textarea[name="orderNotes"]').value;
    
    const orderData = {
        id: generateOrderId(),
        customer: {
            fullName: customerFormData.get('fullName'),
            phone: customerFormData.get('phone'),
            email: customerFormData.get('email')
        },
        shippingAddress: {
            fullName: customerFormData.get('fullName'),
            phone: customerFormData.get('phone'),
            province: shippingFormData.get('province'),
            district: shippingFormData.get('district'),
            ward: shippingFormData.get('ward'),
            address: shippingFormData.get('address')
        },
        items: checkoutState.cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            const itemPrice = product.onSale ? product.salePrice : product.originalPrice;
            return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: itemPrice
            };
        }),
        subtotal: calculateSubtotal(),
        shippingFee: checkoutState.shippingFee,
        discount: checkoutState.discount,
        total: calculateSubtotal() + checkoutState.shippingFee - checkoutState.discount,
        paymentMethod: paymentMethod,
        orderNotes: orderNotes,
        couponCode: checkoutState.couponCode,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    return orderData;
}

function processOrder(orderData) {
    try {
        // Add order to orders array (simulation)
        orders.push({
            id: orderData.id,
            customerId: 'CUST' + Date.now(),
            customerName: orderData.customer.fullName,
            customerEmail: orderData.customer.email,
            customerPhone: orderData.customer.phone,
            items: orderData.items,
            subtotal: orderData.subtotal,
            shippingFee: orderData.shippingFee,
            total: orderData.total,
            status: orderData.status,
            paymentMethod: orderData.paymentMethod,
            shippingAddress: orderData.shippingAddress,
            createdAt: orderData.createdAt,
            updatedAt: orderData.createdAt
        });
        
        // Update product stock
        orderData.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                product.stock -= item.quantity;
            }
        });
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success modal
        showOrderSuccess(orderData);
        
    } catch (error) {
        showMessage('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', 'error');
        
        // Reset button
        document.querySelector('.btn-place-order').disabled = false;
        document.querySelector('.btn-place-order').innerHTML = '<i class="fas fa-shopping-bag"></i> Đặt hàng';
    }
}

function showOrderSuccess(orderData) {
    document.getElementById('order-id').textContent = orderData.id;
    document.getElementById('order-total').textContent = formatCurrency(orderData.total);
    
    document.getElementById('order-success-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function goHome() {
    window.location.href = 'index.html';
}

function viewOrder() {
    // This would redirect to order tracking page
    alert('Chức năng xem đơn hàng sẽ được phát triển!');
    goHome();
}

// Utility functions
function generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return 'ORD' + timestamp.substr(-6) + random;
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

function showMessage(message, type = 'info') {
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

// Export functions for global use
window.loadDistricts = loadDistricts;
window.loadWards = loadWards;
window.applyCoupon = applyCoupon;
window.placeOrder = placeOrder;
window.goHome = goHome;
window.viewOrder = viewOrder;