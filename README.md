# Yoga Huyền Trang - Website Đặt Lịch Tập & Bán Sản Phẩm Yoga

Website thương mại điện tử và đặt lịch học yoga chuyên nghiệp dành cho trung tâm **Yoga Huyền Trang**, tích hợp hệ thống quản trị (Admin Portal) độc lập dành cho một người quản lý duy nhất.

---

## 🧘‍♀️ Các Tính Năng Chính

### 1. Phía Học Viên & Khách Hàng (Public Interface)
- **Trang chủ hiện đại**: Giới thiệu thương hiệu, thống kê ấn tượng, lớp học yoga tiêu biểu và các sản phẩm bán chạy.
- **Lịch lớp học tương tác**: Xem lịch học 7 ngày trong tuần, lọc ca sáng/chiều/tối, chọn phòng tập và đặt chỗ trực tuyến.
- **Cửa hàng Yoga**: Danh mục thảm tập, trang phục, dụng cụ yoga, tinh dầu. Tìm kiếm, lọc theo giá và xem chi tiết sản phẩm.
- **Giỏ hàng & Đặt hàng**: Quản lý giỏ hàng nhanh, tính phí ship, hỗ trợ hình thức thanh toán COD hoặc Chuyển khoản ngân hàng.
- **Tài khoản cá nhân**: Theo dõi danh sách ca học đã đăng ký (có thể hủy ca học trước giờ quy định), lịch sử đơn hàng và cập nhật thông tin cá nhân.
- **Trang thông tin**: Giới thiệu câu chuyện phòng tập, form liên hệ tư vấn nhanh.

### 2. Phía Quản Trị Viên (Admin Portal - `/admin`)
- **Dashboard tổng quan**: Báo cáo doanh thu, đơn hàng mới, ca học trong ngày, số lượng học viên.
- **Quản lý lớp học**: Thêm/Sửa/Xóa lớp yoga, sức chứa, học phí, cấp độ, thời lượng, ảnh đại diện.
- **Quản lý lịch giảng dạy**: Lên lịch ca học theo ngày/tuần, gán phòng học, đánh dấu hủy ca.
- **Quản lý sản phẩm**: Thêm/Sửa/Xóa thảm tập, dụng cụ, quản lý số lượng tồn kho, giá khuyến mãi.
- **Quản lý đơn hàng**: Theo dõi đơn hàng, cập nhật trạng thái vận chuyển và thanh toán.
- **Quản lý đặt lịch**: Danh sách học viên đặt ca, điểm danh học viên tham gia, hủy ca.
- **Quản lý học viên**: Danh sách tài khoản, số điện thoại, phân quyền quản trị.
- **Cài đặt hệ thống**: Cấu hình số hotline, địa chỉ cơ sở, số tài khoản ngân hàng nhận tiền chuyển khoản.

---

## 🛠 Công Nghệ Sử Dụng

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Tailored Design System, Sage Green Palette, Responsive & Smooth Micro-animations)
- **Routing**: React Router DOM v7
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Triggers)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Form Handling**: React Hook Form
- **Date Handling**: Date-fns

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu
- Node.js (v18 trở lên)
- Git

### Các bước cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/chifunedarklord/huyen-trang-yoga.git
   cd huyen-trang-yoga
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường:**
   Tạo file `.env` dựa trên file `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Khởi tạo cơ sở dữ liệu:**
   Chạy nội dung file `supabase_schema.sql` trong SQL Editor của Supabase Dashboard.

5. **Chạy máy chủ phát triển:**
   ```bash
   npm run dev
   ```

6. **Build cho môi trường Production:**
   ```bash
   npm run build
   ```
