import React, { useEffect, useState } from "react";
import {
  Car,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  Shield,
  MapPin,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { CarContext } from "../../context/carContext";

const DriverLoginPage = () => {
  const navigate = useNavigate();
  const { handlePostLoginDriver, handlePostRegisterDriver } = AuthContext();
  const { cars } = CarContext();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
    vehicleType: "",
    licenseNumber: "",
    vehicleNumber: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await handlePostLoginDriver(formData.email, formData.password);
      } else {
        await handlePostRegisterDriver(
          formData.name,
          formData.phone,
          formData.vehicleType,
          formData.licenseNumber,
          formData.vehicleNumber,
          formData.email,
          formData.password
        );
        setIsLogin(true);
        setFormData({
          email: "",
          password: "",
          name: "",
          phone: "",
          confirmPassword: "",
          vehicleType: "",
          licenseNumber: "",
          vehicleNumber: "",
        });
      }
    } catch (error) {
      console.error(isLogin ? "Lỗi đăng nhập:" : "Lỗi đăng ký:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      confirmPassword: "",
      vehicleType: "",
      licenseNumber: "",
      vehicleNumber: "",
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-green-700 p-12 flex-col justify-center relative overflow-hidden">
        <div
          className="absolute top-[30px] left-[30px] w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft color="#ffffff" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full"></div>

        <div className="relative z-10 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">VnCar Driver</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Trở thành đối tác
            <br />
            <span className="text-green-200">tài xế của chúng tôi</span>
          </h2>

          <p className="text-lg text-green-100 mb-8 leading-relaxed">
            Gia nhập mạng lưới tài xế VnCar và bắt đầu kiếm thu nhập ổn định với
            lịch trình linh hoạt.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <span>Thu nhập ổn định và minh bạch</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <span>Lịch trình làm việc linh hoạt</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <span>Hỗ trợ 24/7 và bảo hiểm toàn diện</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-200">10K+</div>
              <div className="text-sm text-green-100">
                Tài xế đang hoạt động
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-200">4.8★</div>
              <div className="text-sm text-green-100">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-green-500 p-3 rounded-xl">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">VnCar Driver</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? "Đăng nhập tài xế" : "Đăng ký làm tài xế"}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? "Đăng nhập để bắt đầu nhận chuyến"
                : "Tạo tài khoản tài xế để bắt đầu kiếm thu nhập"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required={!isLogin}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required={!isLogin}
                  />
                </div>

                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required={!isLogin}
                  >
                    {cars && cars.length > 0 ? (
                      <>
                        <option value="" disabled>
                          Chọn loại xe
                        </option>
                        {cars.map((car: any) => (
                          <option key={car.id} value={car.id}>
                            {car.type_car}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="" disabled>
                        Không có loại xe nào
                      </option>
                    )}
                  </select>
                </div>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="Số bằng lái xe"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required={!isLogin}
                  />
                </div>

                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="vehicleNumber"
                    placeholder="Biển số xe"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-green-500 hover:text-green-600">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Đang đăng nhập..." : "Đang đăng ký..."}
                </div>
              ) : isLogin ? (
                "Đăng nhập"
              ) : (
                "Đăng ký làm tài xế"
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Chưa có tài khoản tài xế?" : "Đã có tài khoản?"}
              <button
                onClick={toggleAuthMode}
                className="ml-2 text-green-500 hover:text-green-600 font-medium"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </div>

          {/* Back to user login */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Đăng nhập với tài khoản khách hàng
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Bằng cách {isLogin ? "đăng nhập" : "đăng ký"}, bạn đồng ý với
            <a href="#" className="text-green-500 hover:underline mx-1">
              Điều khoản đối tác tài xế
            </a>
            và
            <a href="#" className="text-green-500 hover:underline ml-1">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverLoginPage;
