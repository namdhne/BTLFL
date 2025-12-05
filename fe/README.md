# Nhà Sách - Hệ Thống Quản Lý Bán Truyện

Ứng dụng web quản lý và bán truyện, tiểu thuyết với giao diện hiện đại sử dụng React + TypeScript + Vite.

## Tính Năng Chính

### Dành Cho Khách Hàng
- **Trang chủ**: Hiển thị danh sách truyện với tìm kiếm và phân trang (4 sản phẩm/trang)
- **Chi tiết sản phẩm**: Xem thông tin chi tiết và thêm vào giỏ hàng
- **Giỏ hàng**: Quản lý sản phẩm, cập nhật số lượng, thanh toán
- **Lịch sử đơn hàng**: Xem danh sách đơn hàng đã đặt với trạng thái
- **Tài khoản**: Quản lý thông tin cá nhân (email, số điện thoại, địa chỉ)

### Dành Cho Admin
- **Dashboard**: Thống kê tổng quan với biểu đồ (tổng truyện, đơn hàng, doanh thu)
- **Quản lý truyện**: CRUD sản phẩm (thêm, sửa, xóa)
- **Quản lý đơn hàng**: Xem chi tiết và cập nhật trạng thái đơn hàng (đang xử lý, hoàn thành, đã hủy)

## Công Nghệ Sử Dụng

### Frontend
- **React 19.2.0**: Framework UI
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **TailwindCSS 4.1.17**: Styling với gradient theme (blue-purple)
- **Redux Toolkit 2.11.0**: State management (cart, user)
- **React Router 7.9.6**: Client-side routing
- **Lucide React**: Icons
- **Axios**: HTTP client

### Backend
- **Node.js + Express**: REST API
- **MongoDB + Mongoose**: Database
- **TypeScript**: Type safety

## Cấu Trúc Dự Án

```
fe/
├── src/
│   ├── components/          # Reusable components (Input, Toast)
│   ├── layouts/            # Layout wrappers (ClientLayout, AdminLayout)
│   ├── pages/
│   │   ├── admin/          # Admin pages (Dashboard, Product, Invoice)
│   │   ├── client/         # Client pages (Home, Cart, Invoice, Profile)
│   │   └── common/         # Auth pages (Login, Register)
│   ├── router/             # Route guards
│   ├── services/           # API services
│   ├── store/              # Redux store & reducers
│   └── types/              # TypeScript interfaces
be/
├── src/
│   ├── config/             # Database & system config
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   └── routes/             # API endpoints
```

## Chạy Ứng Dụng

### Frontend
```bash
cd fe
npm install
npm run dev
```

### Backend
```bash
cd be
npm install
npm run dev
```

## Tài Khoản Mẫu

### Admin
- Username: `admin`
- Password: `admin123`

### Khách hàng
- Đăng ký tài khoản mới tại `/register`

## Tính Năng Nổi Bật

- ✅ **Tìm kiếm**: Tìm truyện theo tên
- ✅ **Phân trang**: Hiển thị 4 truyện mỗi trang
- ✅ **LocalStorage**: Lưu giỏ hàng, đơn hàng, thông tin cá nhân
- ✅ **Responsive**: Giao diện tương thích mobile
- ✅ **Gradient Theme**: Màu xanh-tím hiện đại
- ✅ **Real-time Update**: Cập nhật trạng thái đơn hàng trực tiếp

## API Endpoints

### Products
- `GET /api/products` - Lấy danh sách truyện
- `GET /api/products/:id` - Chi tiết truyện
- `POST /api/products` - Thêm truyện mới (Admin)
- `PATCH /api/products/:id` - Cập nhật truyện (Admin)
- `DELETE /api/products/:id` - Xóa truyện (Admin)

### Users
- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `GET /api/users` - Danh sách user (Admin)

## Ghi Chú

- Đơn hàng được lưu trong LocalStorage với key `invoices_{username}`
- Thông tin cá nhân lưu trong LocalStorage với key `profile_{username}`
- Thumbnail mặc định cho truyện: `https://placehold.co/400x600?text=Book+Cover`

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
