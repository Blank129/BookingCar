import React, { createContext, useContext, ReactNode, useState } from "react";
import { postDecodeToken, postLoginGoogle, postLoginWeb, postRegisterWeb } from "../service/apiUser";
import { useNavigate } from "react-router-dom";
import { postLoginDriver, postRegisterDriver } from "../service/apiDriver";

type AuthContextType = {
  userInfo: any;
  setUserInfo: any;
  driverInfo: any;
  setDriverInfo: any;
  handlePostLoginGoogle: any;
  handlePostLoginWeb: any;
  handlePostLoginDriver: any;
  handlePostRegisterWeb: any;
  handlePostRegisterDriver: any;
  handlePostDecodeToken: any;
};

const AuthContexts = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>("");
  const [driverInfo, setDriverInfo] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePostLoginGoogle = async (id_token: any) => {
    try {
      const data = await postLoginGoogle(id_token);
      if (data.status === 200) {
        setUserInfo(data.data);
        if (data.data.user.role === 'driver') {
          navigate("/driver/dashboard");
        } else {
          navigate("/");
        }
      } else {
        console.error("Đăng nhập thất bại:", data);
        // alert(data?.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi fetch tới backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostLoginWeb = async (email: any, password: any) => {
    try {
      const res = await postLoginWeb(email, password);
      if (res.status === 200) {
        localStorage.setItem("userInfoWeb", res.data.token);
        if (res.data.user.role === 'driver') {
          navigate("/driver/dashboard");
        } else {
          navigate("/");
        }
      } else {
        console.log("res else", res);
        alert(res);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const handlePostRegisterWeb = async (
    name: any,
    phone: any,
    email: any,
    password: any,
  ) => {
    try {
      const res = await postRegisterWeb(name, phone, email, password);
      if (res.status === 200) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  const handlePostLoginDriver = async (email: any, password: any) => {
    try {
      const res = await postLoginDriver(email, password);
      if (res.status === 200) {
        localStorage.setItem("driverInfo", res.data.token);
        navigate("/driver/dashboard");
      } else {
        console.log("res else", res);
        alert(res);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập driver:", error);
    }
  };

  const handlePostRegisterDriver = async (
    name: any, phone: any,id_type_car: any, drive_license_number: any, plate_license: any, email: any, password: any
  ) => {
    try {
      const res = await postRegisterDriver(name, phone,id_type_car, drive_license_number, plate_license, email, password);
      if (res.status === 200) {
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng ký driver:", error);
    }
  };

  const handlePostDecodeToken = async (token: any) => {
    try {
      const res = await postDecodeToken(token);
      if(res.status === 200) {
        setUserInfo(res.data);
        setDriverInfo(res.data);
      }
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  }

  return (
    <AuthContexts.Provider
      value={{
        userInfo,
        setUserInfo,
        driverInfo,
        setDriverInfo,
        handlePostLoginGoogle,
        handlePostLoginWeb,
        handlePostLoginDriver,
        handlePostRegisterWeb,
        handlePostRegisterDriver,
        handlePostDecodeToken
      }}
    >
      {children}
    </AuthContexts.Provider>
  );
};

export const AuthContext = (): AuthContextType => {
  const context = useContext(AuthContexts);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};