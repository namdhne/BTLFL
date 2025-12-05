import { useEffect, useState } from "react";
import { TrendingUp, Package, DollarSign, ShoppingCart, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Invoice } from "@/types/Invoice";
import type { Product } from "@/types/Product";
import { getAllProducts } from "@/services/ProductService";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Lấy tất cả đơn hàng từ tất cả user
      const allInvoices: Invoice[] = [];
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("invoices_")) {
          const invoices = JSON.parse(localStorage.getItem(key) || "[]");
          allInvoices.push(...invoices);
        }
      });

      // Tính toán thống kê
      const totalRevenue = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const completedOrders = allInvoices.filter((inv) => inv.status === "completed").length;
      const pendingOrders = allInvoices.filter((inv) => inv.status === "pending").length;
      const cancelledOrders = allInvoices.filter((inv) => inv.status === "cancelled").length;

      // Lấy sản phẩm
      const response = await getAllProducts();
      const productsData = response?.data || [];

      setStats({
        totalRevenue,
        totalOrders: allInvoices.length,
        totalProducts: productsData.length,
        completedOrders,
        pendingOrders,
        cancelledOrders,
      });

      setProducts(productsData);
      setRecentOrders(allInvoices.slice(0, 5));
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-blue-200 mt-1">Tổng quan Nhà Sách</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 hover:border-purple-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <DollarSign className="text-white" size={24} />
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <p className="text-blue-200 text-sm mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 hover:border-purple-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <p className="text-blue-200 text-sm mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 hover:border-purple-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-600 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
          </div>
          <p className="text-blue-200 text-sm mb-1">Tổng số truyện</p>
          <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 hover:border-purple-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
          </div>
          <p className="text-blue-200 text-sm mb-1">Đơn hoàn thành</p>
          <p className="text-2xl font-bold text-white">{stats.completedOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 max-w-2xl mx-auto w-full">
          <h3 className="text-xl font-bold text-white mb-6">Trạng thái đơn hàng</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Completed */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.completedOrders / stats.totalOrders) * 251.2 || 0} 251.2`}
                  className="transition-all duration-500"
                />
                {/* Pending */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.pendingOrders / stats.totalOrders) * 251.2 || 0} 251.2`}
                  strokeDashoffset={`-${(stats.completedOrders / stats.totalOrders) * 251.2 || 0}`}
                  className="transition-all duration-500"
                />
                {/* Cancelled */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.cancelledOrders / stats.totalOrders) * 251.2 || 0} 251.2`}
                  strokeDashoffset={`-${((stats.completedOrders + stats.pendingOrders) / stats.totalOrders) * 251.2 || 0}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                  <p className="text-sm text-blue-200">Đơn hàng</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-blue-200 text-sm">Hoàn thành</span>
              </div>
              <span className="text-white font-semibold">{stats.completedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span className="text-blue-200 text-sm">Đang xử lý</span>
              </div>
              <span className="text-white font-semibold">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-blue-200 text-sm">Đã hủy</span>
              </div>
              <span className="text-white font-semibold">{stats.cancelledOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Đơn hàng gần đây</h3>
        {recentOrders.length === 0 ? (
          <p className="text-blue-200 text-center py-8">Chưa có đơn hàng nào</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-800">
                  <th className="text-left text-blue-200 text-sm font-semibold py-3 px-4">Mã đơn</th>
                  <th className="text-left text-blue-200 text-sm font-semibold py-3 px-4">Khách hàng</th>
                  <th className="text-left text-blue-200 text-sm font-semibold py-3 px-4">Ngày</th>
                  <th className="text-left text-blue-200 text-sm font-semibold py-3 px-4">Tổng tiền</th>
                  <th className="text-left text-blue-200 text-sm font-semibold py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-blue-900/50 hover:bg-blue-900/20">
                    <td className="py-3 px-4 text-white text-sm">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-4 text-white text-sm">{order.username}</td>
                    <td className="py-3 px-4 text-blue-200 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 text-white text-sm font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      {order.status === "completed" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                          Hoàn thành
                        </span>
                      )}
                      {order.status === "pending" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
                          Đang xử lý
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                          Đã hủy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
