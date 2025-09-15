# SportZone - Hệ thống E-Commerce Thể thao

Hệ thống website bán hàng thể thao đa dạng với đầy đủ tính năng cho khách hàng và quản trị viên.

## 🚀 Tính năng chính

### Khách hàng (Frontend)
- ✅ **Đa ngôn ngữ**: Hỗ trợ Tiếng Việt và Tiếng Anh
- ✅ **Đăng ký/Đăng nhập**: Quản lý tài khoản người dùng
- ✅ **Xem sản phẩm**: Danh sách sản phẩm theo danh mục
- ✅ **Đánh giá sản phẩm**: Hệ thống rating và reviews
- ✅ **Yêu thích & Chia sẻ**: Thêm vào wishlist và share sản phẩm
- ✅ **Giỏ hàng**: Thêm/sửa/xóa sản phẩm trong giỏ
- ✅ **Đặt hàng**: Quy trình checkout hoàn chỉnh
- ✅ **Thanh toán**: COD và chuyển khoản ngân hàng
- ✅ **Địa chỉ thông minh**: Chọn Tỉnh → Quận/Huyện → Phường/Xã
- ✅ **Thông báo hết hàng**: Hiển thị trạng thái tồn kho

### Quản trị viên (Admin Panel)

#### 1. Dashboard - Tổng quan
- 📊 **Metrics**: Doanh thu, đơn hàng, khách hàng, sản phẩm, phí ship
- 📈 **Biểu đồ**: Doanh thu theo ngày, đơn hàng theo ngày
- 🔥 **Sản phẩm bán chạy**: Top products với doanh số
- 🥧 **Phân bố danh mục**: Biểu đồ phân tích danh mục
- 📦 **Trạng thái đơn hàng**: Đã giao, đang giao, chờ xử lý
- ⏰ **Bộ lọc thời gian**: 7, 30, 90 ngày với so sánh % tăng trưởng

#### 2. Quản lý Sản phẩm
- 🔍 **Tìm kiếm**: Tìm theo tên sản phẩm
- 🏷️ **Lọc**: Theo danh mục, trạng thái
- ➕ **Thêm sản phẩm**: Form đầy đủ (tên, danh mục, mô tả, giá, số lượng, hình ảnh)
- ⚙️ **Quản lý**: Chỉnh sửa, xóa, cập nhật trạng thái
- 🌟 **Tùy chọn**: Sản phẩm nổi bật, sale, hàng sắp về

#### 3. Quản lý Đơn hàng
- 🔍 **Tìm kiếm**: Theo mã đơn hàng, tên khách hàng
- 📊 **Lọc**: Theo trạng thái đơn hàng
- 👁️ **Xem chi tiết**: Thông tin đầy đủ khách hàng và sản phẩm
- ✅ **Cập nhật trạng thái**: Xác nhận tình trạng đơn hàng
- 📥 **Xuất Excel**: Export danh sách đơn hàng
- 🗑️ **Quản lý**: Xóa đơn hàng khi cần

#### 4. Quản lý Người dùng
- 🔍 **Tìm kiếm**: Theo tên, email, số điện thoại
- 📊 **Lọc**: Theo trạng thái hoạt động
- 👁️ **Xem chi tiết**: Thông tin người dùng đầy đủ
- 📥 **Xuất Excel**: Export danh sách users
- 🗑️ **Xóa**: Quản lý tài khoản người dùng

#### 5. Quản lý Admin
- ➕ **Thêm admin**: Email, họ tên, mật khẩu, vai trò
- 👑 **Phân quyền**: Super Admin, Admin, Staff
- ✏️ **Chỉnh sửa**: Cập nhật thông tin admin
- 🗑️ **Xóa**: Quản lý tài khoản admin (trừ Super Admin)

#### 6. Cài đặt Hệ thống
- 🚚 **Phí vận chuyển**: Thêm, xóa, sửa theo địa điểm
- 💰 **Cài đặt chung**: Ngưỡng miễn phí vận chuyển
- 🖼️ **Banner**: Upload và thay đổi ảnh banner
- 🏦 **Thông tin ngân hàng**: Cập nhật thông tin chuyển khoản
- 📞 **Hỗ trợ 24/7**: Thay đổi thông tin liên hệ
- 🏷️ **Danh mục**: Thay đổi ảnh danh mục sản phẩm

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Font Awesome Icons, Google Fonts
- **Charts**: Chart.js cho dashboard
- **Responsive**: Mobile-first design
- **Data**: JSON-based mock data (có thể dễ dàng chuyển sang API)
- **Storage**: LocalStorage cho demo

## 📁 Cấu trúc dự án

```
sportzone/
├── index.html              # Trang chủ
├── admin.html              # Trang quản trị
├── checkout.html           # Trang thanh toán
├── css/
│   ├── style.css          # CSS chính
│   ├── responsive.css     # CSS responsive
│   ├── admin.css          # CSS admin panel
│   └── checkout.css       # CSS checkout
├── js/
│   ├── data.js           # Dữ liệu mock
│   ├── language.js       # Hỗ trợ đa ngôn ngữ
│   ├── main.js          # JavaScript chính
│   ├── admin.js         # JavaScript admin
│   └── checkout.js      # JavaScript checkout
└── README.md            # Tài liệu hướng dẫn
```

## 🚀 Hướng dẫn sử dụng

### Khởi động Website

1. **Tải xuống**: Download toàn bộ thư mục dự án
2. **Mở file**: Mở `index.html` bằng trình duyệt web
3. **Hoặc sử dụng Live Server**: Nếu có VS Code, sử dụng Live Server extension

### Truy cập Admin Panel

1. **URL**: Mở `admin.html` trực tiếp
2. **Hoặc từ trang chủ**: (Có thể thêm link admin nếu cần)
3. **Tài khoản**: Super Admin (demo - không cần đăng nhập)

### Demo Account

**Khách hàng:**
- Email: demo@customer.com
- Password: 123456

**Admin:**
- Role: Super Admin
- Quyền: Truy cập tất cả tính năng

## 🎯 Tính năng nổi bật

### 1. Đa ngôn ngữ (Multilingual)
Website hỗ trợ chuyển đổi giữa Tiếng Việt và Tiếng Anh một cách mượt mà.

### 2. Responsive Design
Giao diện tương thích hoàn hảo trên mọi thiết bị: Desktop, Tablet, Mobile.

### 3. Địa chỉ Việt Nam
Hệ thống chọn địa chỉ thông minh với dữ liệu đầy đủ các tỉnh/thành phố Việt Nam.

### 4. Dashboard Analytics
Bảng điều khiển với biểu đồ và thống kê chi tiết cho admin.

### 5. Real-time Updates
Cập nhật trạng thái đơn hàng, tồn kho real-time.

## 🔧 Tùy chỉnh

### Thêm sản phẩm mới
1. Vào **Admin Panel** → **Quản lý sản phẩm**
2. Click **"Thêm sản phẩm mới"**
3. Điền thông tin và upload hình ảnh
4. Lưu sản phẩm

### Cấu hình phí ship
1. **Admin Panel** → **Cài đặt** → **Phí vận chuyển**
2. Thêm/sửa phí theo từng tỉnh/thành phố
3. Cài đặt ngưỡng miễn phí ship

### Tùy chỉnh giao diện
- **Colors**: Sửa trong `css/style.css` (CSS Variables)
- **Fonts**: Thay đổi Google Fonts import
- **Layout**: Responsive grid system

## 📱 Tương thích

- ✅ Chrome (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔄 Phát triển tiếp

### Backend Integration
Dự án hiện tại sử dụng mock data. Để tích hợp backend:

1. **API Endpoints**: Thay thế mock data bằng API calls
2. **Database**: MySQL/PostgreSQL cho production
3. **Authentication**: JWT tokens cho bảo mật
4. **File Upload**: Cloud storage cho hình ảnh
5. **Payment Gateway**: Tích hợp VNPay, Momo, ZaloPay

### Tính năng bổ sung
- 📧 **Email notifications**: Gửi mail xác nhận đơn hàng
- 📊 **Advanced Analytics**: Báo cáo chi tiết hơn
- 💬 **Chat support**: Hỗ trợ trực tuyến
- 🔔 **Push notifications**: Thông báo real-time
- 📱 **Mobile App**: React Native / Flutter

## 🐛 Báo lỗi & Hỗ trợ

Nếu gặp vấn đề hoặc cần hỗ trợ:
1. Kiểm tra console browser (F12)
2. Đảm bảo JavaScript được bật
3. Thử refresh trang hoặc clear cache
4. Liên hệ developer để được hỗ trợ

## 📄 License

Dự án này được phát triển cho mục đích demo và học tập. Có thể sử dụng và chỉnh sửa tự do.

---

**🏆 SportZone - Hệ thống E-Commerce thể thao hoàn chỉnh!**

*Được phát triển bởi MiniMax Agent với tình yêu thể thao* ⚽🏀🎾