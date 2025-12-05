# Nhà Sách - Hệ Thống Quản Lý Bán Truyện

Ứng dụng web fullstack quản lý và bán truyện, tiểu thuyết với giao diện hiện đại.

## 📋 Mô Tả Dự Án

Hệ thống bao gồm 2 phần chính:
- **Frontend**: React + TypeScript + Vite với TailwindCSS
- **Backend**: Node.js + Express + MongoDB

## 🎯 Tính Năng

### 👤 Khách Hàng
- Xem danh sách truyện với tìm kiếm và phân trang
- Xem chi tiết sản phẩm và thêm vào giỏ hàng
- Quản lý giỏ hàng và thanh toán
- Xem lịch sử đơn hàng với trạng thái
- Quản lý thông tin cá nhân

### 👨‍💼 Admin
- Dashboard thống kê tổng quan
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng và cập nhật trạng thái
- Xem chi tiết từng đơn hàng

## 🛠️ Công Nghệ

### Frontend
- React 19.2.0
- TypeScript
- Vite
- TailwindCSS 4.1.17
- Redux Toolkit 2.11.0
- React Router 7.9.6
- Lucide React Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- TypeScript

## 📁 Cấu Trúc Thư Mục

```
BaiTapPTTKHT/
├── fe/                      # Frontend React
│   ├── src/
│   │   ├── components/      # Component tái sử dụng
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Các trang
│   │   │   ├── admin/       # Trang admin
│   │   │   ├── client/      # Trang khách hàng
│   │   │   └── common/      # Trang chung (login, register)
│   │   ├── router/          # Route guards
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── types/           # TypeScript types
│   └── package.json
│
└── be/                      # Backend Node.js
    ├── src/
    │   ├── config/          # Database & system config
    │   ├── controllers/     # Request handlers
    │   ├── models/          # Mongoose models
    │   └── routes/          # API routes
    └── package.json
```

## 🚀 Cài Đặt và Chạy

### 1. Clone Repository
```bash
git clone <repository-url>
cd BaiTapPTTKHT
```

### 2. Cài Đặt Backend
```bash
cd be
npm install
npm run dev
```

Backend chạy tại: `http://localhost:8080`

### 3. Cài Đặt Frontend
```bash
cd fe
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## 👥 Tài Khoản Demo

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Quyền**: Quản lý sản phẩm, đơn hàng, xem thống kê

### Khách Hàng
- Đăng ký tài khoản mới tại `/register`

## 🔌 API Endpoints

### Products (Truyện)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/products` | Lấy danh sách truyện | Public |
| GET | `/api/products/:id` | Chi tiết truyện | Public |
| POST | `/api/products` | Thêm truyện mới | Admin |
| PATCH | `/api/products/:id` | Cập nhật truyện | Admin |
| DELETE | `/api/products/:id` | Xóa truyện | Admin |

### Users
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/users/register` | Đăng ký tài khoản | Public |
| POST | `/api/users/login` | Đăng nhập | Public |
| GET | `/api/users` | Danh sách users | Admin |

## 💡 Các Tính Năng Nổi Bật

- ✅ Tìm kiếm truyện theo tên
- ✅ Phân trang (4 sản phẩm/trang)
- ✅ Giỏ hàng với Redux state management
- ✅ Lưu trữ đơn hàng trong LocalStorage
- ✅ Quản lý thông tin cá nhân
- ✅ Dashboard admin với biểu đồ thống kê
- ✅ Cập nhật trạng thái đơn hàng (Pending, Completed, Cancelled)
- ✅ Responsive design
- ✅ Gradient theme xanh-tím hiện đại

## 📝 Ghi Chú Kỹ Thuật

### LocalStorage Keys
- `invoices_{username}`: Lưu đơn hàng của từng user
- `profile_{username}`: Lưu thông tin cá nhân
- `cart`: Lưu giỏ hàng hiện tại

### Database
- MongoDB collection: `products`, `users`
- Product schema bao gồm: title, description, price, discountPercentage, rating, stock, thumbnail, slug

### State Management
- Redux Toolkit với 2 reducers:
  - `CartReducer`: Quản lý giỏ hàng
  - `UserReducer`: Quản lý authentication

## 🎨 Theme & Styling

- TailwindCSS với gradient background `from-blue-950 to-purple-950`
- Lucide React icons
- Responsive breakpoints: sm, md, lg, xl
- Dark theme với slate color palette

## 📱 Responsive Design

Hỗ trợ đầy đủ trên:
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

## 🔐 Authentication

- JWT-based authentication (nếu backend có cấu hình)
- Role-based access control (Admin/Customer)
- Protected routes với route guards

## 📦 Build Production

### Frontend
```bash
cd fe
npm run build
```

### Backend
```bash
cd be
npm run build
```

## 🐛 Troubleshooting

### Port đã được sử dụng
- Frontend: Đổi port trong `vite.config.ts`
- Backend: Đổi port trong `src/config/system.ts`

### MongoDB connection failed
- Kiểm tra MongoDB đang chạy
- Kiểm tra connection string trong `src/config/database.ts`

## 📄 License

MIT License

## 👨‍💻 Tác Giả

Dự án bài tập phân tích thiết kế hệ thống
