// Mock Data for Sports Shop

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Nike Air Max 270",
        nameEn: "Nike Air Max 270",
        category: "running",
        description: "Giày chạy bộ Nike Air Max 270 với đệm khí tối ưu",
        descriptionEn: "Nike Air Max 270 running shoes with optimal air cushioning",
        originalPrice: 3500000,
        salePrice: 2800000,
        discount: 20,
        stock: 25,
        images: [
            "https://via.placeholder.com/300x300/007bff/ffffff?text=Nike+Air+Max",
            "https://via.placeholder.com/300x300/28a745/ffffff?text=Nike+Air+Max+2"
        ],
        featured: true,
        onSale: true,
        isNew: false,
        rating: 4.5,
        reviews: 128,
        colors: ["Đen", "Trắng", "Xanh"],
        sizes: ["39", "40", "41", "42", "43"]
    },
    {
        id: 2,
        name: "Adidas Ultraboost 22",
        nameEn: "Adidas Ultraboost 22",
        category: "running",
        description: "Giày chạy bộ Adidas Ultraboost với công nghệ Boost",
        descriptionEn: "Adidas Ultraboost running shoes with Boost technology",
        originalPrice: 4200000,
        salePrice: 4200000,
        discount: 0,
        stock: 15,
        images: [
            "https://via.placeholder.com/300x300/fd7e14/ffffff?text=Adidas+Ultraboost"
        ],
        featured: true,
        onSale: false,
        isNew: true,
        rating: 4.8,
        reviews: 89,
        colors: ["Đen", "Trắng"],
        sizes: ["39", "40", "41", "42", "43", "44"]
    },
    {
        id: 3,
        name: "Áo thun Nike Dri-FIT",
        nameEn: "Nike Dri-FIT T-Shirt",
        category: "gym",
        description: "Áo thun tập gym Nike với công nghệ Dri-FIT",
        descriptionEn: "Nike gym t-shirt with Dri-FIT technology",
        originalPrice: 890000,
        salePrice: 690000,
        discount: 22,
        stock: 0,
        images: [
            "https://via.placeholder.com/300x300/28a745/ffffff?text=Nike+Dri-FIT"
        ],
        featured: false,
        onSale: true,
        isNew: false,
        rating: 4.3,
        reviews: 45,
        colors: ["Đen", "Xanh navy", "Xám"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 4,
        name: "Bóng đá FIFA World Cup 2024",
        nameEn: "FIFA World Cup 2024 Football",
        category: "football",
        description: "Bóng đá chính thức FIFA World Cup 2024",
        descriptionEn: "Official FIFA World Cup 2024 football",
        originalPrice: 1200000,
        salePrice: 1200000,
        discount: 0,
        stock: 30,
        images: [
            "https://via.placeholder.com/300x300/e74c3c/ffffff?text=FIFA+Ball"
        ],
        featured: true,
        onSale: false,
        isNew: true,
        rating: 4.9,
        reviews: 156,
        colors: ["Trắng/Đỏ"],
        sizes: ["Size 5"]
    },
    {
        id: 5,
        name: "Vợt tennis Wilson Pro Staff",
        nameEn: "Wilson Pro Staff Tennis Racket",
        category: "tennis",
        description: "Vợt tennis Wilson Pro Staff dành cho người chơi chuyên nghiệp",
        descriptionEn: "Wilson Pro Staff tennis racket for professional players",
        originalPrice: 6500000,
        salePrice: 5200000,
        discount: 20,
        stock: 8,
        images: [
            "https://via.placeholder.com/300x300/9b59b6/ffffff?text=Wilson+Tennis"
        ],
        featured: false,
        onSale: true,
        isNew: false,
        rating: 4.7,
        reviews: 23,
        colors: ["Đen/Đỏ"],
        sizes: ["Grip 2", "Grip 3", "Grip 4"]
    },
    {
        id: 6,
        name: "Bóng rổ Spalding NBA",
        nameEn: "Spalding NBA Basketball",
        category: "basketball",
        description: "Bóng rổ chính thức NBA Spalding",
        descriptionEn: "Official NBA Spalding basketball",
        originalPrice: 850000,
        salePrice: 680000,
        discount: 20,
        stock: 20,
        images: [
            "https://via.placeholder.com/300x300/fd7e14/ffffff?text=NBA+Ball"
        ],
        featured: true,
        onSale: true,
        isNew: false,
        rating: 4.6,
        reviews: 78,
        colors: ["Cam/Đen"],
        sizes: ["Size 7"]
    }
];

// Categories Data
const categories = [
    {
        id: "football",
        name: "Bóng đá",
        nameEn: "Football",
        image: "https://via.placeholder.com/200x200/28a745/ffffff?text=Football"
    },
    {
        id: "basketball",
        name: "Bóng rổ",
        nameEn: "Basketball",
        image: "https://via.placeholder.com/200x200/fd7e14/ffffff?text=Basketball"
    },
    {
        id: "tennis",
        name: "Tennis",
        nameEn: "Tennis",
        image: "https://via.placeholder.com/200x200/e74c3c/ffffff?text=Tennis"
    },
    {
        id: "running",
        name: "Chạy bộ",
        nameEn: "Running",
        image: "https://via.placeholder.com/200x200/9b59b6/ffffff?text=Running"
    },
    {
        id: "gym",
        name: "Gym & Fitness",
        nameEn: "Gym & Fitness",
        image: "https://via.placeholder.com/200x200/17a2b8/ffffff?text=Gym"
    }
];

// Sample Orders Data
const orders = [
    {
        id: "ORD001",
        customerId: "CUST001",
        customerName: "Nguyễn Văn A",
        customerEmail: "nguyenvana@email.com",
        customerPhone: "0901234567",
        items: [
            {
                productId: 1,
                productName: "Nike Air Max 270",
                quantity: 1,
                price: 2800000,
                size: "42",
                color: "Đen"
            }
        ],
        subtotal: 2800000,
        shippingFee: 30000,
        total: 2830000,
        status: "pending", // pending, confirmed, shipping, delivered, cancelled
        paymentMethod: "cod", // cod, bank_transfer
        shippingAddress: {
            fullName: "Nguyễn Văn A",
            phone: "0901234567",
            province: "Hồ Chí Minh",
            district: "Quận 1",
            ward: "Phường Bến Nghé",
            address: "123 Nguyễn Huệ"
        },
        createdAt: "2024-12-15T10:30:00Z",
        updatedAt: "2024-12-15T10:30:00Z"
    }
];

// Sample Customers Data
const customers = [
    {
        id: "CUST001",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0901234567",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        registeredAt: "2024-10-15T08:00:00Z",
        totalOrders: 5,
        totalSpent: 12500000,
        status: "active" // active, inactive
    }
];

// Admin Users Data
const adminUsers = [
    {
        id: "ADMIN001",
        fullName: "Super Admin",
        email: "admin@sportzone.com",
        role: "super_admin", // super_admin, admin, staff
        permissions: ["all"],
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-12-15T09:00:00Z",
        status: "active"
    }
];

// Vietnam Address Data
const vietnamAddress = {
    "Hà Nội": {
        "Quận Ba Đình": ["Phường Phúc Xá", "Phường Trúc Bạch", "Phường Vĩnh Phúc", "Phường Cống Vị"],
        "Quận Hoàn Kiếm": ["Phường Phúc Tân", "Phường Đồng Xuân", "Phường Hàng Mã", "Phường Hàng Buồm"],
        "Quận Tây Hồ": ["Phường Phú Thượng", "Phường Nhật Tân", "Phường Tứ Liên", "Phường Quảng An"]
    },
    "Hồ Chí Minh": {
        "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh"],
        "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"],
        "Quận 5": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"]
    },
    "Đà Nẵng": {
        "Quận Hải Châu": ["Phường Hải Châu I", "Phường Hải Châu II", "Phường Phước Ninh", "Phường Hòa Thuận Tây"],
        "Quận Thanh Khê": ["Phường Thanh Khê Tây", "Phường Thanh Khê Đông", "Phường Xuân Hà", "Phường Tân Chính"]
    }
};

// Shipping Fees by Province
const shippingFees = {
    "Hà Nội": 25000,
    "Hồ Chí Minh": 30000,
    "Đà Nẵng": 35000,
    "Cần Thơ": 40000,
    "Hải Phòng": 35000,
    "Default": 50000
};

// System Settings
const systemSettings = {
    freeShippingThreshold: 500000, // Free shipping for orders over 500k
    currency: "VND",
    taxRate: 0.1, // 10% VAT
    bankInfo: {
        bankName: "Vietcombank",
        accountNumber: "1234567890",
        accountName: "SPORT ZONE CO LTD",
        branch: "Chi nhánh TP.HCM"
    },
    supportInfo: {
        hotline: "1900-1234",
        email: "support@sportzone.com",
        workingHours: "8:00 - 22:00 (Thứ 2 - Chủ nhật)"
    },
    banners: [
        {
            id: 1,
            title: "Khuyến mãi lớn - Giảm đến 50%",
            titleEn: "Big Sale - Up to 50% Off",
            description: "Trang thiết bị thể thao chính hãng",
            descriptionEn: "Authentic sports equipment",
            image: "https://via.placeholder.com/1200x400/007bff/ffffff?text=Banner+1",
            link: "#",
            active: true
        }
    ]
};

// Sales Statistics (Mock Data)
const salesStats = {
    today: {
        revenue: 5400000,
        orders: 12,
        customers: 8
    },
    thisMonth: {
        revenue: 125000000,
        orders: 156,
        customers: 89,
        growthRevenue: 15.5, // % growth compared to last month
        growthOrders: 8.2,
        growthCustomers: 12.1
    },
    dailyRevenue: [ // Last 30 days
        2100000, 3200000, 1800000, 4500000, 3900000, 2800000, 5200000,
        3100000, 4200000, 2900000, 3800000, 4100000, 2700000, 3600000,
        4800000, 3300000, 2200000, 3900000, 4600000, 3200000, 2800000,
        4300000, 3700000, 2900000, 4100000, 3500000, 4800000, 3200000,
        3900000, 5400000
    ],
    topProducts: [
        { id: 1, name: "Nike Air Max 270", sales: 45, revenue: 126000000 },
        { id: 4, name: "Bóng đá FIFA World Cup 2024", sales: 38, revenue: 45600000 },
        { id: 6, name: "Bóng rổ Spalding NBA", sales: 32, revenue: 21760000 },
        { id: 2, name: "Adidas Ultraboost 22", sales: 28, revenue: 117600000 }
    ],
    categoryDistribution: [
        { category: "running", percentage: 35, count: 73 },
        { category: "football", percentage: 25, count: 38 },
        { category: "basketball", percentage: 20, count: 32 },
        { category: "tennis", percentage: 12, count: 8 },
        { category: "gym", percentage: 8, count: 5 }
    ]
};

// Export data (for use in other files)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        categories,
        orders,
        customers,
        adminUsers,
        vietnamAddress,
        shippingFees,
        systemSettings,
        salesStats
    };
}