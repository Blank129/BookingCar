import { useState, useEffect } from "react";
import {
  Car,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Navigation,
  User,
  Calendar,
  TrendingUp,
  LogOut,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { updateOnlineStatus } from "../../service/apiDriver";

interface TripRequest {
  id: string;
  passenger: {
    name: string;
    rating: number;
    phone: string;
  };
  pickup: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  destination: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  distance: number;
  fare: number;
  estimatedTime: string;
  vehicleType: string;
}

interface Trip {
  id: string;
  passenger: string;
  pickup: string;
  destination: string;
  fare: number;
  date: string;
  status: "completed" | "cancelled";
  distance: number;
}

const mockTripRequests: TripRequest[] = [
  {
    id: "1",
    passenger: {
      name: "Nguyễn Văn A",
      rating: 4.8,
      phone: "0909123456",
    },
    pickup: {
      name: "Sân bay Tân Sơn Nhất",
      address: "Tân Bình, TP.HCM",
      coordinates: [10.8181, 106.6517],
    },
    destination: {
      name: "Landmark 81",
      address: "Bình Thạnh, TP.HCM",
      coordinates: [10.7953, 106.7212],
    },
    distance: 12.5,
    fare: 150000,
    estimatedTime: "25 phút",
    vehicleType: "FastCar",
  },
];

const mockTripHistory: Trip[] = [
  {
    id: "1",
    passenger: "Nguyễn Văn A",
    pickup: "Sân bay Tân Sơn Nhất",
    destination: "Landmark 81",
    fare: 150000,
    date: "2025-01-15",
    status: "completed",
    distance: 12.5,
  },
  {
    id: "2",
    passenger: "Trần Thị B",
    pickup: "Chợ Bến Thành",
    destination: "Nhà hát Thành phố",
    fare: 80000,
    date: "2025-01-15",
    status: "completed",
    distance: 5.2,
  },
  {
    id: "3",
    passenger: "Lê Văn C",
    pickup: "Công viên Tao Đàn",
    destination: "Bệnh viện Chợ Rẫy",
    fare: 120000,
    date: "2025-01-14",
    status: "completed",
    distance: 8.7,
  },
];

export default function HomeDriver() {
  const navigate = useNavigate();
  const {
    userInfo,
    setUserInfo,
    driverInfo,
    setDriverInfo,
    handlePostDecodeToken,
  } = AuthContext();
  const [activeTab, setActiveTab] = useState<
    "requests" | "earnings" | "history"
  >("requests");
  const [isOnline, setIsOnline] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripRequest | null>(null);
  const [tripStatus, setTripStatus] = useState<
    "going_to_pickup" | "arrived_pickup" | "passenger_onboard" | "completed"
  >("going_to_pickup");
  const [tripRequests, setTripRequests] =
    useState<TripRequest[]>(mockTripRequests);
  const [earnings, setEarnings] = useState({
    today: 450000,
    week: 2800000,
    month: 12500000,
  });

  useEffect(() => {
    const driverToken = localStorage.getItem("driverInfo");
    if (driverToken) {
      handlePostDecodeToken(driverToken);
    } else {
      setDriverInfo(null);
    }
  }, []);

  useEffect(() => {
    let watchId: number;

    if (isOnline && driverInfo?.user?.id) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Gọi API cập nhật vị trí
          updateOnlineStatus(driverInfo.user.id, true, latitude, longitude);
        },
        (err) => {
          console.error("Lỗi theo dõi vị trí:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline, driverInfo?.user?.id]);

  // useEffect(() => {
  //   if (!driverInfo?.user?.id || !isOnline) return;

  //   console.log("Bắt đầu cập nhật vị trí mỗi 10 giây...");

  //   const interval = setInterval(() => {
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         const { latitude, longitude } = pos.coords;
  //         console.log("Cập nhật vị trí:", latitude, longitude);
  //         updateOnlineStatus(driverInfo.user.id, true, latitude, longitude);
  //       },
  //       (err) => {
  //         console.error("Lỗi khi lấy vị trí:", err);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         maximumAge: 10000,
  //         timeout: 10000,
  //       }
  //     );
  //   }, 10000);

  //   return () => {
  //     console.log("Dừng cập nhật vị trí");
  //     clearInterval(interval);
  //   };
  // }, [driverInfo?.user?.id, isOnline]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAcceptTrip = (trip: TripRequest) => {
    setCurrentTrip(trip);
    setTripRequests((prev) => prev.filter((t) => t.id !== trip.id));
    setTripStatus("going_to_pickup");
  };

  const handleRejectTrip = (tripId: string) => {
    setTripRequests((prev) => prev.filter((t) => t.id !== tripId));
  };

  const handleTripStatusUpdate = () => {
    if (!currentTrip) return;

    switch (tripStatus) {
      case "going_to_pickup":
        setTripStatus("arrived_pickup");
        break;
      case "arrived_pickup":
        setTripStatus("passenger_onboard");
        break;
      case "passenger_onboard":
        setTripStatus("completed");
        setEarnings((prev) => ({
          ...prev,
          today: prev.today + currentTrip.fare,
        }));
        setTimeout(() => {
          setCurrentTrip(null);
          setTripStatus("going_to_pickup");
        }, 2000);
        break;
    }
  };

  const getStatusText = () => {
    switch (tripStatus) {
      case "going_to_pickup":
        return "Đang đến điểm đón";
      case "arrived_pickup":
        return "Đã đến điểm đón";
      case "passenger_onboard":
        return "Khách đã lên xe";
      case "completed":
        return "Hoàn thành chuyến đi";
    }
  };

  const getStatusButton = () => {
    switch (tripStatus) {
      case "going_to_pickup":
        return "Đã đến điểm đón";
      case "arrived_pickup":
        return "Khách đã lên xe";
      case "passenger_onboard":
        return "Hoàn thành chuyến";
      case "completed":
        return "Chuyến đi hoàn thành";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("userInfoWeb");
    localStorage.removeItem("driverInfo");
    setUserInfo(null);
    navigate("/driver/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  VnCar Driver
                </h1>
                <p className="text-sm text-gray-600">Bảng điều khiển tài xế</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Online/Offline Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {isOnline ? "Đang online" : "Offline"}
                </span>
                <button
                  onClick={() => {
                    setIsOnline(!isOnline);
                    if (!isOnline) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        const { latitude, longitude } = pos.coords;
                        updateOnlineStatus(
                          driverInfo.user.id,
                          true,
                          latitude,
                          longitude
                        );
                      });
                    } else {
                      updateOnlineStatus(driverInfo.user.id, false);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isOnline ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userInfo?.user?.name || "Tài xế"}
                  </p>
                  <p className="text-xs text-gray-600">Tài xế</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Current Trip */}
        {currentTrip && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Chuyến đi hiện tại
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tripStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {getStatusText()}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thông tin khách hàng
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {currentTrip.passenger.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ⭐ {currentTrip.passenger.rating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {currentTrip.pickup.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentTrip.pickup.address}
                      </p>
                    </div>
                  </div>

                  <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6"></div>

                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {currentTrip.destination.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentTrip.destination.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Quãng đường:</span>
                    <span className="font-medium">
                      {currentTrip.distance} km
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Thời gian dự kiến:</span>
                    <span className="font-medium">
                      {currentTrip.estimatedTime}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Tiền cước:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(currentTrip.fare)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleTripStatusUpdate}
                    disabled={tripStatus === "completed"}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {getStatusButton()}
                  </button>

                  <button className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center space-x-2">
                    <Navigation className="w-4 h-4" />
                    <span>Dẫn đường</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Thu nhập hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(earnings.today)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Thu nhập tuần này</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(earnings.week)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Thu nhập tháng này</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(earnings.month)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Yêu cầu chuyến đi
              </button>
              <button
                onClick={() => setActiveTab("earnings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "earnings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Thu nhập
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Lịch sử chuyến đi
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Trip Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {!isOnline ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Bạn đang offline
                    </h3>
                    <p className="text-gray-600">
                      Bật chế độ online để nhận yêu cầu chuyến đi
                    </p>
                  </div>
                ) : tripRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có yêu cầu mới
                    </h3>
                    <p className="text-gray-600">
                      Chờ yêu cầu chuyến đi từ khách hàng
                    </p>
                  </div>
                ) : (
                  tripRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {request.passenger.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ⭐ {request.passenger.rating}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatPrice(request.fare)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.distance} km
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {request.pickup.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {request.pickup.address}
                            </p>
                          </div>
                        </div>

                        <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6"></div>

                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {request.destination.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {request.destination.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAcceptTrip(request)}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Chấp nhận</span>
                        </button>
                        <button
                          onClick={() => handleRejectTrip(request.id)}
                          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-medium mb-2">Hôm nay</h3>
                    <p className="text-3xl font-bold">
                      {formatPrice(earnings.today)}
                    </p>
                    <p className="text-green-100 text-sm mt-2">
                      +12% so với hôm qua
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-medium mb-2">Tuần này</h3>
                    <p className="text-3xl font-bold">
                      {formatPrice(earnings.week)}
                    </p>
                    <p className="text-blue-100 text-sm mt-2">
                      +8% so với tuần trước
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-medium mb-2">Tháng này</h3>
                    <p className="text-3xl font-bold">
                      {formatPrice(earnings.month)}
                    </p>
                    <p className="text-purple-100 text-sm mt-2">
                      +15% so với tháng trước
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thống kê chi tiết
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">24</p>
                      <p className="text-sm text-gray-600">Chuyến hôm nay</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">156</p>
                      <p className="text-sm text-gray-600">Chuyến tuần này</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                      <p className="text-sm text-gray-600">
                        Đánh giá trung bình
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">8.5h</p>
                      <p className="text-sm text-gray-600">
                        Giờ online hôm nay
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {mockTripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {trip.passenger}
                            </p>
                            <p className="text-sm text-gray-600">{trip.date}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-gray-900">
                              {trip.pickup}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-sm text-gray-900">
                              {trip.destination}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(trip.fare)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trip.distance} km
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
