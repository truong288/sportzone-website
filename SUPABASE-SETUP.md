# SportZone - Hướng dẫn setup Supabase Database

## 🎯 Tổng quan
Tài liệu này hướng dẫn cách thiết lập và tích hợp Supabase database cho website SportZone để lưu trữ dữ liệu thực tế thay vì chỉ localStorage.

## 📋 Các bước thiết lập

### Bước 1: Thiết lập Database Schema
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard/project/nmrbzdwhzbkbpmizxqvo)
2. Vào phần **SQL Editor**
3. Copy toàn bộ nội dung file `database_setup.sql` và paste vào SQL Editor
4. Nhấn **Run** để tạo tables và dữ liệu mẫu

### Bước 2: Lấy API Keys
1. Trong Supabase Dashboard, vào **Settings** > **API**
2. Copy các thông tin sau:
   - **Project URL**: `https://nmrbzdwhzbkbpmizxqvo.supabase.co`
   - **Anon Public Key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` (key dài)

### Bước 3: Cập nhật cấu hình
1. Mở file `js/supabase.js`
2. Thay đổi giá trị `SUPABASE_ANON_KEY`:
```javascript
const SUPABASE_ANON_KEY = 'YOUR_REAL_ANON_KEY_HERE';
```

### Bước 4: Cập nhật files trên GitHub
Upload các files sau lên GitHub repository:

1. **checkout.html** - Trang thanh toán mới
2. **css/checkout.css** - Styles cho trang thanh toán  
3. **js/checkout.js** - Logic thanh toán đã cập nhật
4. **js/supabase.js** - Cấu hình và functions Supabase
5. **js/admin-supabase.js** - Admin panel với Supabase
6. **admin.html** - Cập nhật để load Supabase scripts

## 🔧 Cấu hình Supabase Authentication

### Thiết lập Auth Settings
1. Vào **Authentication** > **Settings** trong Supabase Dashboard
2. Cấu hình **Site URL**: `https://truong288.github.io/sportzone-website/`
3. Thêm **Redirect URLs**:
   - `https://truong288.github.io/sportzone-website/`
   - `https://truong288.github.io/sportzone-website/admin.html`

## 📊 Database Schema đã tạo

### Tables chính:
- **users**: Quản lý người dùng và admin
- **categories**: Danh mục sản phẩm
- **products**: Sản phẩm
- **orders**: Đơn hàng
- **order_items**: Chi tiết đơn hàng
- **banners**: Banner trang chủ
- **admin_settings**: Cài đặt hệ thống

### Dữ liệu mẫu đã có:
- 5 danh mục sản phẩm cơ bản
- 4 sản phẩm mẫu
- 3 banners
- Tài khoản admin: `admin@sportzone.vn` / `admin123`

## 🚀 Tính năng mới sau khi tích hợp

### ✅ Đã hoàn thành:
1. **Trang thanh toán hoàn chính**: `/checkout.html`
2. **Admin dashboard với dữ liệu thực**: Thống kê từ database
3. **Quản lý sản phẩm**: CRUD với Supabase
4. **Quản lý đơn hàng**: Lưu trữ và cập nhật trạng thái
5. **Quản lý người dùng**: Xem danh sách, khóa/mở khóa
6. **Quản lý admin**: Tạo tài khoản admin mới
7. **Cài đặt hệ thống**: Lưu cài đặt vào database

### 🔄 Tự động hóa:
- **RLS (Row Level Security)**: Bảo mật dữ liệu theo quyền
- **Triggers**: Tự động cập nhật timestamp
- **Indexes**: Tối ưu hiệu suất truy vấn

## 🔐 Bảo mật

### Row Level Security (RLS) đã cấu hình:
- Users chỉ xem được data của mình
- Admin có quyền truy cập toàn bộ
- Public chỉ xem được sản phẩm/danh mục active

### Authentication:
- Sử dụng Supabase Auth
- Mã hóa mật khẩu tự động
- Session management

## 🛠️ Troubleshooting

### Nếu website không kết nối được database:
1. Kiểm tra API key trong `js/supabase.js`
2. Kiểm tra Network tab trong DevTools
3. Đảm bảo RLS policies đã được tạo

### Nếu không đăng nhập được admin:
1. Chạy lại phần tạo admin user trong SQL
2. Hoặc tạo user mới qua Supabase Dashboard > Authentication

### Nếu orders không được lưu:
- Website sẽ fallback về localStorage nếu Supabase fail
- Kiểm tra Console logs để debug

## 📈 Sau khi hoàn thành

Website sẽ có đầy đủ tính năng:
- ✅ Trang thanh toán chính thức
- ✅ Admin dashboard với thống kê thực
- ✅ Quản lý dữ liệu qua database
- ✅ Bảo mật và phân quyền
- ✅ Lưu trữ đơn hàng thực tế

## 🎉 Test thử nghiệm

### Test trang thanh toán:
1. Thêm sản phẩm vào giỏ hàng từ trang chủ
2. Truy cập: `https://truong288.github.io/sportzone-website/checkout.html`
3. Điền thông tin và đặt hàng

### Test admin:
1. Truy cập: `https://truong288.github.io/sportzone-website/admin.html`
2. Đăng nhập: `admin@sportzone.vn` / `admin123`
3. Kiểm tra các tính năng quản lý

---

**⚠️ Lưu ý quan trọng**: Nhớ thay đổi mật khẩu admin mặc định sau khi thiết lập xong!
