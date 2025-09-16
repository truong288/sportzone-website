// Checkout functionality

// Sample cart data for testing
let cartItems = [
    {
        id: 1,
        name: "Giày bóng đá Nike Mercurial",
        price: 2500000,
        quantity: 1,
        image: "https://via.placeholder.com/60x60/007bff/ffffff?text=Nike",
        size: "42"
    },
    {
        id: 2,
        name: "Áo thun thể thao Adidas",
        price: 450000,
        quantity: 2,
        image: "https://via.placeholder.com/60x60/28a745/ffffff?text=Adidas",
        size: "L"
    }
];

// Shipping costs by city
const shippingCosts = {
    'hanoi': 25000,
    'hcm': 25000,
    'danang': 30000,
    'other': 40000
};

// Discount codes
const discountCodes = {
    'SPORT2024': { type: 'percent', value: 10, minOrder: 500000 },
    'NEWCUSTOMER': { type: 'fixed', value: 50000, minOrder: 300000 },
    'FREESHIP': { type: 'shipping', value: 0, minOrder: 200000 }
};

// District data by city
const districts = {
    'hanoi': ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân'],
    'hcm': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Thủ Đức'],
    'danang': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
    'other': ['Chọn quận/huyện']
};

// Load cart data from localStorage or use sample data
function loadCartData() {
    const savedCart = localStorage.getItem('sportzone_cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    
    if (cartItems.length === 0) {
        // Redirect to homepage if cart is empty
        alert('Giỏ hàng của bạn đang trống!');
        window.location.href = 'index.html';
        return;
    }
    
    displayOrderItems();
    calculateTotal();
}

// Display order items
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-info">
                    ${item.size ? `Size: ${item.size} | ` : ''}Số lượng: ${item.quantity}
                </div>
            </div>
            <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
}

// Calculate order total
function calculateTotal() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const city = document.getElementById('city').value;
    const shipping = shippingCosts[city] || shippingCosts['other'];
    
    // Apply discount if any
    const discountAmount = getDiscountAmount(subtotal);
    let finalShipping = shipping;
    
    // Check if discount covers shipping
    const appliedDiscount = getAppliedDiscount();
    if (appliedDiscount && appliedDiscount.type === 'shipping') {
        finalShipping = 0;
    }
    
    const total = subtotal + finalShipping - discountAmount;
    
    // Update UI
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(finalShipping);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (discountAmount > 0 || finalShipping !== shipping) {
        discountRow.style.display = 'flex';
        let discountText = '';
        if (discountAmount > 0) discountText += `-${formatPrice(discountAmount)}`;
        if (finalShipping !== shipping) discountText += ' (Free ship)';
        document.getElementById('discount').textContent = discountText;
    } else {
        discountRow.style.display = 'none';
    }
}

// Update shipping cost when city changes
function updateShipping() {
    const city = document.getElementById('city').value;
    const districtSelect = document.getElementById('district');
    
    // Update districts
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    if (city && districts[city]) {
        districts[city].forEach(district => {
            const option = document.createElement('option');
            option.value = district.toLowerCase().replace(/\s+/g, '');
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
    
    calculateTotal();
}

// Apply discount code
function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value.trim().toUpperCase();
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (!discountCode) {
        alert('Vui lòng nhập mã giảm giá!');
        return;
    }
    
    if (!discountCodes[discountCode]) {
        alert('Mã giảm giá không hợp lệ!');
        return;
    }
    
    const discount = discountCodes[discountCode];
    if (subtotal < discount.minOrder) {
        alert(`Đơn hàng tối thiểu ${formatPrice(discount.minOrder)} để sử dụng mã này!`);
        return;
    }
    
    // Save applied discount
    localStorage.setItem('applied_discount', discountCode);
    
    // Show success message
    let message = '';
    if (discount.type === 'percent') {
        message = `Áp dụng thành công! Giảm ${discount.value}%`;
    } else if (discount.type === 'fixed') {
        message = `Áp dụng thành công! Giảm ${formatPrice(discount.value)}`;
    } else if (discount.type === 'shipping') {
        message = 'Áp dụng thành công! Miễn phí vận chuyển';
    }
    
    alert(message);
    calculateTotal();
    
    // Disable discount input
    document.getElementById('discountCode').disabled = true;
    document.querySelector('.discount-input button').textContent = 'Đã áp dụng';
    document.querySelector('.discount-input button').disabled = true;
}

// Get applied discount
function getAppliedDiscount() {
    const appliedCode = localStorage.getItem('applied_discount');
    return appliedCode ? discountCodes[appliedCode] : null;
}

// Get discount amount
function getDiscountAmount(subtotal) {
    const discount = getAppliedDiscount();
    if (!discount) return 0;
    
    if (discount.type === 'percent') {
        return Math.floor(subtotal * discount.value / 100);
    } else if (discount.type === 'fixed') {
        return Math.min(discount.value, subtotal);
    }
    
    return 0;
}

// Format price to Vietnamese currency
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Handle payment method change
function handlePaymentMethodChange() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const bankingDetails = document.getElementById('bankingDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'banking') {
                bankingDetails.style.display = 'block';
                // Generate order code for transfer note
                const orderCode = 'SP' + Date.now().toString().slice(-6);
                document.getElementById('transferNote').textContent = `SPORTZONE ${orderCode}`;
            } else {
                bankingDetails.style.display = 'none';
            }
        });
    });
}

// Submit order
async function submitOrder(event) {
    event.preventDefault();
    
    // Validate form
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const orderData = {
        customer: {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email')
        },
        shipping: {
            city: formData.get('city'),
            district: formData.get('district'),
            address: formData.get('address')
        },
        payment: {
            method: formData.get('paymentMethod')
        },
        items: cartItems,
        notes: formData.get('orderNotes'),
        discount: getAppliedDiscount(),
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingCost: getShippingCost(),
        discountAmount: getDiscountAmount(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)),
        total: calculateOrderTotal(),
        orderCode: generateOrderCode()
    };
    
    // Show loading modal
    document.getElementById('loadingModal').style.display = 'block';
    
    try {
        // Save order to Supabase if available, otherwise save locally
        if (typeof supabase !== 'undefined' && supabase) {
            await createOrder(orderData);
        } else {
            // Fallback to localStorage for testing
            saveOrderLocally(orderData);
        }
        
        // Hide loading modal
        document.getElementById('loadingModal').style.display = 'none';
        
        // Show success modal
        document.getElementById('orderCode').textContent = orderData.orderCode;
        document.getElementById('successModal').style.display = 'block';
        
        // Clear cart
        localStorage.removeItem('sportzone_cart');
        localStorage.removeItem('applied_discount');
        
    } catch (error) {
        console.error('Order submission error:', error);
        
        // Hide loading modal
        document.getElementById('loadingModal').style.display = 'none';
        
        // Show error (but still save locally as backup)
        saveOrderLocally(orderData);
        
        // Show success modal anyway (order saved locally)
        document.getElementById('orderCode').textContent = orderData.orderCode;
        document.getElementById('successModal').style.display = 'block';
        
        // Clear cart
        localStorage.removeItem('sportzone_cart');
        localStorage.removeItem('applied_discount');
    }
}

// Get shipping cost
function getShippingCost() {
    const city = document.getElementById('city').value;
    let shipping = shippingCosts[city] || shippingCosts['other'];
    
    // Check if discount covers shipping
    const appliedDiscount = getAppliedDiscount();
    if (appliedDiscount && appliedDiscount.type === 'shipping') {
        shipping = 0;
    }
    
    return shipping;
}

// Save order locally as backup
function saveOrderLocally(orderData) {
    let orders = JSON.parse(localStorage.getItem('sportzone_orders')) || [];
    orders.push({
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('sportzone_orders', JSON.stringify(orders));
}

// Calculate final order total
function calculateOrderTotal() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const city = document.getElementById('city').value;
    let shipping = shippingCosts[city] || shippingCosts['other'];
    const discountAmount = getDiscountAmount(subtotal);
    
    // Check if discount covers shipping
    const appliedDiscount = getAppliedDiscount();
    if (appliedDiscount && appliedDiscount.type === 'shipping') {
        shipping = 0;
    }
    
    return subtotal + shipping - discountAmount;
}

// Generate order code
function generateOrderCode() {
    const prefix = 'SP';
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return prefix + timestamp.slice(-6) + random;
}

// Save order to localStorage (backup method)
function saveOrder(orderData) {
    saveOrderLocally(orderData);
}

// Go back to home page
function goToHome() {
    window.location.href = 'index.html';
}

// Auto-fill customer info if logged in
function autoFillCustomerInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
        document.getElementById('fullName').value = currentUser.fullName || '';
        document.getElementById('email').value = currentUser.email || '';
        document.getElementById('phone').value = currentUser.phone || '';
    }
}

// Initialize checkout page
function initCheckout() {
    loadCartData();
    handlePaymentMethodChange();
    autoFillCustomerInfo();
    
    // Load previously applied discount
    const appliedDiscount = localStorage.getItem('applied_discount');
    if (appliedDiscount) {
        document.getElementById('discountCode').value = appliedDiscount;
        document.getElementById('discountCode').disabled = true;
        document.querySelector('.discount-input button').textContent = 'Đã áp dụng';
        document.querySelector('.discount-input button').disabled = true;
        calculateTotal();
    }
    
    // Add event listeners
    document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
    document.getElementById('city').addEventListener('change', updateShipping);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initCheckout);
