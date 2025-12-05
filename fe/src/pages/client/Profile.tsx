import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from "lucide-react";
import Toast from "@/components/Toast";

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
}

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || "",
    email: "",
    phone: "",
    address: "",
    joinDate: new Date().toISOString(),
  });

  useEffect(() => {
    // Load profile từ localStorage
    if (user?.username) {
      const savedProfile = localStorage.getItem(`profile_${user.username}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (user?.username) {
      localStorage.setItem(`profile_${user.username}`, JSON.stringify(profile));
      setToastMessage("✅ Cập nhật thông tin thành công!");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reload profile từ localStorage
    if (user?.username) {
      const savedProfile = localStorage.getItem(`profile_${user.username}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Thông Tin Cá Nhân
          </h2>
          <p className="text-blue-200 mt-1">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-blue-500/50"
          >
            <Edit2 size={18} />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <X size={18} />
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-green-500/50"
            >
              <Save size={18} />
              Lưu
            </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-blue-800">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{profile.username}</h3>
            <p className="text-blue-300">{user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
              <User size={16} />
              Tên người dùng
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              disabled
              className="w-full py-3 px-4 rounded-lg bg-blue-900/30 border border-blue-700 text-white placeholder-blue-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="example@email.com"
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-700 text-white placeholder-blue-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
              <Phone size={16} />
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="0123456789"
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-700 text-white placeholder-blue-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
              <Calendar size={16} />
              Ngày tham gia
            </label>
            <input
              type="text"
              value={formatDate(profile.joinDate)}
              disabled
              className="w-full py-3 px-4 rounded-lg bg-blue-900/30 border border-blue-700 text-white placeholder-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
              <MapPin size={16} />
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Nhập địa chỉ của bạn"
              rows={3}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-700 text-white placeholder-blue-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Thống kê</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {JSON.parse(localStorage.getItem(`invoices_${user?.username || 'guest'}`) || '[]').length}
            </p>
            <p className="text-blue-200 text-sm mt-1">Đơn hàng</p>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              {JSON.parse(localStorage.getItem(`invoices_${user?.username || 'guest'}`) || '[]')
                .filter((inv: any) => inv.status === 'completed').length}
            </p>
            <p className="text-blue-200 text-sm mt-1">Hoàn thành</p>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {JSON.parse(localStorage.getItem(`invoices_${user?.username || 'guest'}`) || '[]')
                .filter((inv: any) => inv.status === 'pending').length}
            </p>
            <p className="text-blue-200 text-sm mt-1">Đang xử lý</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
