import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Invoice } from "@/types/Invoice";
import { Package, Calendar, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    // Giả lập load dữ liệu từ localStorage
    const fetchInvoices = () => {
      try {
        setLoading(true);
        const savedInvoices = localStorage.getItem(`invoices_${user?.username || 'guest'}`);
        if (savedInvoices) {
          setInvoices(JSON.parse(savedInvoices));
        }
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

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
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CheckCircle size={14} />
            Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
            <Clock size={14} />
            Đang xử lý
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white">
            <XCircle size={14} />
            Đã hủy
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Lịch Sử Đơn Hàng
          </h2>
          <p className="text-blue-200 mt-1">
            Quản lý và theo dõi đơn hàng của bạn
          </p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto text-blue-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-white mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-blue-300">
            Hãy mua sắm và tạo đơn hàng đầu tiên của bạn!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 hover:border-purple-600 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Đơn hàng #{invoice._id.slice(-8).toUpperCase()}
                    </h3>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="flex items-center gap-2 text-blue-200 text-sm">
                    <Calendar size={14} />
                    {formatDate(invoice.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-blue-200 text-sm mb-1">
                    <DollarSign size={14} />
                    Tổng tiền
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {formatPrice(invoice.totalAmount)}
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-800 pt-4">
                <h4 className="text-white font-semibold mb-3">Chi tiết sản phẩm:</h4>
                <div className="space-y-2">
                  {invoice.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-900/30 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-white font-medium">{item.product.title}</p>
                          <p className="text-blue-300 text-sm">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
