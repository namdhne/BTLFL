import { useEffect, useState } from "react";
import type { Invoice } from "@/types/Invoice";
import { Package, Calendar, DollarSign, User, Edit, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import Toast from "@/components/Toast";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Invoice["status"]>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    try {
      setLoading(true);
      // Lấy tất cả đơn hàng từ tất cả user
      const allInvoices: Invoice[] = [];
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("invoices_")) {
          const invoices = JSON.parse(localStorage.getItem(key) || "[]");
          allInvoices.push(...invoices);
        }
      });
      // Sắp xếp theo ngày mới nhất
      allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInvoices(allInvoices);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchSearch = 
      invoice.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || invoice.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateInvoiceStatus = (invoiceId: string, newStatus: Invoice["status"]) => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("invoices_")) {
          const invoices: Invoice[] = JSON.parse(localStorage.getItem(key) || "[]");
          const updatedInvoices = invoices.map((inv) => 
            inv._id === invoiceId ? { ...inv, status: newStatus, updatedAt: new Date().toISOString() } : inv
          );
          localStorage.setItem(key, JSON.stringify(updatedInvoices));
        }
      });
      fetchInvoices();
      setToastMessage(`✅ Cập nhật trạng thái đơn hàng thành công!`);
    } catch (error) {
      console.error("Failed to update invoice:", error);
      setToastMessage(`❌ Có lỗi xảy ra khi cập nhật!`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
            <CheckCircle size={14} />
            Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
            <Clock size={14} />
            Đang xử lý
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
            <XCircle size={14} />
            Đã hủy
          </span>
        );
    }
  };

  const getStats = () => {
    return {
      total: invoices.length,
      completed: invoices.filter((inv) => inv.status === "completed").length,
      pending: invoices.filter((inv) => inv.status === "pending").length,
      cancelled: invoices.filter((inv) => inv.status === "cancelled").length,
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-100">Quản Lý Đơn Hàng</h2>
        <p className="text-slate-400 mt-1">Theo dõi và quản lý tất cả đơn hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Hoàn thành</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Đang xử lý</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Đã hủy</p>
          <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Tổng doanh thu</p>
          <p className="text-xl font-bold text-blue-500">{formatPrice(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng hoặc mã đơn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-lg">
          <Package className="mx-auto text-slate-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Không có đơn hàng nào</h3>
          <p className="text-slate-400">
            {searchQuery || filterStatus !== "all" ? "Không tìm thấy kết quả phù hợp" : "Chưa có đơn hàng nào"}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left text-slate-300 text-sm font-semibold py-3 px-4">Mã đơn</th>
                  <th className="text-left text-slate-300 text-sm font-semibold py-3 px-4">Khách hàng</th>
                  <th className="text-left text-slate-300 text-sm font-semibold py-3 px-4">Ngày đặt</th>
                  <th className="text-left text-slate-300 text-sm font-semibold py-3 px-4">Tổng tiền</th>
                  <th className="text-left text-slate-300 text-sm font-semibold py-3 px-4">Trạng thái</th>
                  <th className="text-left text-slate-300 text-sm font-semibold py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="border-t border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <span className="text-slate-100 font-mono text-sm">
                        #{invoice._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <span className="text-slate-100">{invoice.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-slate-300 text-sm">{formatDate(invoice.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-slate-400" />
                        <span className="text-slate-100 font-semibold">{formatPrice(invoice.totalAmount)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  Chi tiết đơn hàng #{selectedInvoice._id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{formatDate(selectedInvoice.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-slate-100 font-semibold mb-3">Thông tin khách hàng</h4>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Tên:</span> {selectedInvoice.username}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-slate-100 font-semibold mb-3">Sản phẩm đã mua</h4>
                <div className="space-y-3">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-slate-800 rounded-lg p-4">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-slate-100 font-medium">{item.product.title}</p>
                        <p className="text-slate-400 text-sm">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-100 font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-100 font-semibold text-lg">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-slate-100">
                    {formatPrice(selectedInvoice.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="text-slate-100 font-semibold mb-3">Cập nhật trạng thái</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateInvoiceStatus(selectedInvoice._id, "pending");
                      setSelectedInvoice(null);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                      selectedInvoice.status === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Đang xử lý
                  </button>
                  <button
                    onClick={() => {
                      updateInvoiceStatus(selectedInvoice._id, "completed");
                      setSelectedInvoice(null);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                      selectedInvoice.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Hoàn thành
                  </button>
                  <button
                    onClick={() => {
                      updateInvoiceStatus(selectedInvoice._id, "cancelled");
                      setSelectedInvoice(null);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                      selectedInvoice.status === "cancelled"
                        ? "bg-red-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Đã hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
