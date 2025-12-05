import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LuFacebook,
  LuInstagram,
  LuLayoutDashboard,
  LuShoppingBag,
  LuTwitter,
  LuUser,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/UserReducer";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <header className="bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:from-blue-500 group-hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30">
                <LuShoppingBag className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nhà Sách</h1>
            </NavLink>
         

            <div className="flex items-center gap-6">
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-white hover:text-blue-100 transition-all flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-3 py-2 rounded-full shadow-md hover:shadow-blue-500/50"
                >
                  <LuLayoutDashboard size={20} /> Trang quản trị
                </button>
              )}

              <button
                onClick={() => (user ? handleLogout() : navigate("/login"))}
                className="text-white hover:text-purple-100 transition-all flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3 py-2 rounded-full shadow-md hover:shadow-purple-500/50"
              >
                <LuUser size={20} /> {user ? "Đăng xuất" : "Đăng nhập"}
              </button>
            </div>
          </div>

          <nav className="hidden md:block mt-4 border-t border-blue-800 pt-4">
            <ul className="flex gap-8 justify-center text-blue-200 font-medium">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-white transition-colors ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Trang chủ
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-white transition-colors ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Giỏ hàng
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/invoices"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-white transition-colors ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Đơn hàng
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-white transition-colors ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Tài khoản
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>            
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-b from-blue-950 to-slate-950 text-blue-200 border-t border-blue-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Về chúng tôi
              </h3>
              <p className="text-sm leading-relaxed">
                Nhà sách trực tuyến uy tín với hàng ngàn đầu truyện, tiểu thuyết
                và sách hay từ khắp nơi trên thế giới.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Liên kết nhanh
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Thông tin vận chuyển
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Dịch vụ khách hàng
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Hoàn trả
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Điều khoản & Điều kiện
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Theo dõi đơn hàng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Theo dõi chúng tôi
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 text-center rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all border border-blue-500 shadow-md hover:shadow-blue-500/50"
                >
                  <LuFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all border border-purple-500 shadow-md hover:shadow-purple-500/50"
                >
                  <LuTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-gradient-to-br from-pink-600 to-pink-700 p-3 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all border border-pink-500 shadow-md hover:shadow-pink-500/50"
                >
                  <LuInstagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 My Shop. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
