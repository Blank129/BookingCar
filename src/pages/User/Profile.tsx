import { useEffect, useState } from "react";
import {
  User,
  Edit3,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  History,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  Star,
  Calendar,
  ArrowLeft,
  Camera,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { CarContext } from "../../context/carContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, handlePostDecodeToken } = AuthContext();
  const { profileUser, handleGetProfileUser, handleUpdateProfileUser } = CarContext();
  const [activeTab, setActiveTab] = useState<
    "profile" | "history" | "settings"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    avatar: ""
  });

  // Static user data
  const userData = {
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "+84 909 123 456",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    joinDate: "15/01/2023",
    totalTrips: 47,
    totalSpent: 2850000,
    averageRating: 4.8,
  };

  const tripHistory = [
    {
      id: "1",
      date: "15/01/2025",
      from: "Sân bay Tân Sơn Nhất",
      to: "Chợ Bến Thành",
      vehicle: "FastCar",
      price: 120000,
      status: "completed" as const,
      rating: 5,
    },
    {
      id: "2",
      date: "14/01/2025",
      from: "Landmark 81",
      to: "Nhà hát Thành phố",
      vehicle: "FastBike",
      price: 45000,
      status: "completed" as const,
      rating: 4,
    },
    {
      id: "3",
      date: "13/01/2025",
      from: "Công viên Tao Đàn",
      to: "Bitexco Tower",
      vehicle: "FastPremium",
      price: 85000,
      status: "cancelled" as const,
      rating: 0,
    },
    {
      id: "4",
      date: "12/01/2025",
      from: "Bệnh viện Chợ Rẫy",
      to: "Đại học Bách Khoa",
      vehicle: "FastCar",
      price: 65000,
      status: "completed" as const,
      rating: 5,
    },
    {
      id: "5",
      date: "11/01/2025",
      from: "Vincom Center",
      to: "Saigon Skydeck",
      vehicle: "FastBike",
      price: 35000,
      status: "completed" as const,
      rating: 4,
    },
  ];

  useEffect(() => {
    if (userInfo) {
      handleGetProfileUser(userInfo.user.id);
    }
  }, [userInfo]);

  useEffect(() => {
    const token = localStorage.getItem("userInfoWeb");
    if (token) {
      handlePostDecodeToken(token);
    } else {
      setUserInfo(null);
    }
  }, []);

  useEffect(() => {
    if (profileUser) {
      setEditedProfile({
        name: profileUser.name || "",
        phone: profileUser.phone || "",
        email: profileUser.email || "",
        address: profileUser.address || "",
        avatar: profileUser.avatar || ""
      });
    }
  }, [profileUser]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // console.log("Thông tin đã lưu:", {
    //   name: editedProfile.name,
    //   phone: editedProfile.phone,
    //   email: editedProfile.email,
    //   avatar: editedProfile.avatar
    // });
    
    await handleUpdateProfileUser(userInfo.user.id, editedProfile.name, editedProfile.phone, editedProfile.email, editedProfile.avatar);
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      name: profileUser.name || "",
      phone: profileUser.phone || "",
      email: profileUser.email || "",
      address: profileUser.address || "",
      avatar: profileUser.avatar || ""
    });
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatToVietnamTime = (utcDateString: any) => {
    const utcDate = new Date(utcDateString);

    const vietnamOffsetMs = 7 * 60 * 60 * 1000;
    const vietnamDate = new Date(utcDate.getTime() + vietnamOffsetMs);

    const day = vietnamDate.getDate().toString().padStart(2, "0");
    const month = (vietnamDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = vietnamDate.getFullYear();

    const hours = vietnamDate.getHours().toString().padStart(2, "0");
    const minutes = vietnamDate.getMinutes().toString().padStart(2, "0");
    const seconds = vietnamDate.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Hồ sơ cá nhân
              </h1>
            </div>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto">
                   <img
                      src={editedProfile.avatar || profileUser.avatar}
                      alt={editedProfile.name || profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {editedProfile.name || profileUser.name}
                </h2>
                <p className="text-gray-600">{editedProfile.email || profileUser.email}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {profileUser.totalTrips}
                  </p>
                  <p className="text-sm text-gray-600">Chuyến đi</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">
                    {formatPrice(profileUser.totalSpent)}
                  </p>
                  <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Thông tin cá nhân</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                    activeTab === "history"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span>Lịch sử chuyến đi</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                    activeTab === "settings"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Cài đặt</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm">
              {activeTab === "profile" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Thông tin cá nhân
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Lưu</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Hủy</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span>{profileUser.name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{profileUser.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                           value={editedProfile.phone}
                            onChange={(e) => setEditedProfile(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>{profileUser.phone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày tham gia
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span>
                            {formatToVietnamTime(profileUser.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      {isEditing ? (
                        <textarea
                        value={editedProfile.address}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            address: e.target.value
                          }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <span>{profileUser.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Thống kê tổng quan
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">
                            {profileUser.totalTrips}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tổng chuyến đi
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {formatPrice(profileUser.totalSpent)}
                          </p>
                          <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="w-6 h-6 text-yellow-400 fill-current" />
                            <p className="text-3xl font-bold text-yellow-600">
                              {profileUser.averageRating}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Đánh giá trung bình
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Lịch sử chuyến đi
                  </h3>

                  <div className="space-y-4">
                    {tripHistory.map((trip) => (
                      <div
                        key={trip.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {trip.date}
                                </span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  trip.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {trip.status === "completed"
                                  ? "Hoàn thành"
                                  : "Đã hủy"}
                              </span>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium">
                                  {trip.from}
                                </span>
                              </div>
                              <div className="ml-6 border-l-2 border-dashed border-gray-300 h-4"></div>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm font-medium">
                                  {trip.to}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">
                                Xe: {trip.vehicle}
                              </span>
                              {trip.status === "completed" &&
                                trip.rating > 0 && (
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < trip.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(trip.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Cài đặt
                  </h3>

                  <div className="space-y-8">
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Thông báo
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Thông báo chuyến đi</p>
                              <p className="text-sm text-gray-600">
                                Nhận thông báo về trạng thái chuyến đi
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Email khuyến mãi</p>
                              <p className="text-sm text-gray-600">
                                Nhận email về ưu đãi và khuyến mãi
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Thanh toán
                      </h4>
                      <div className="space-y-3">
                        <button className="flex items-center space-x-3 p-4 w-full hover:bg-gray-50 rounded-lg transition-colors text-left border border-gray-200">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Thẻ tín dụng</p>
                            <p className="text-sm text-gray-600">
                              **** **** **** 1234
                            </p>
                          </div>
                        </button>
                        <button className="flex items-center space-x-3 p-4 w-full hover:bg-gray-50 rounded-lg transition-colors text-left border border-gray-200">
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              M
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Ví MoMo</p>
                            <p className="text-sm text-gray-600">Đã liên kết</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Bảo mật
                      </h4>
                      <button className="flex items-center space-x-3 p-4 w-full hover:bg-gray-50 rounded-lg transition-colors text-left">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Bảo mật tài khoản</p>
                          <p className="text-sm text-gray-600">
                            Thay đổi mật khẩu và cài đặt bảo mật
                          </p>
                        </div>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Hỗ trợ
                      </h4>
                      <div className="space-y-3">
                        <button className="flex items-center space-x-3 p-4 w-full hover:bg-gray-50 rounded-lg transition-colors text-left">
                          <HelpCircle className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Trung tâm trợ giúp</p>
                            <p className="text-sm text-gray-600">
                              Câu hỏi thường gặp và hướng dẫn
                            </p>
                          </div>
                        </button>
                        <button className="flex items-center space-x-3 p-4 w-full hover:bg-gray-50 rounded-lg transition-colors text-left">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Liên hệ hỗ trợ</p>
                            <p className="text-sm text-gray-600">
                              Hotline: 1900 1234
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
