import React, { createContext, useContext, ReactNode, useState } from "react";
import { postDecodeToken, postLoginGoogle, postLoginWeb, postRegisterWeb } from "../service/api";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  userInfo: any;
  setUserInfo: any;
  handlePostLoginGoogle: any;
  handlePostLoginWeb: any;
  handlePostRegisterWeb: any;
  handlePostDecodeToken: any;
};

const AuthContexts = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePostLoginGoogle = async (id_token: any) => {
    try {
      const data = await postLoginGoogle(id_token);
      if (data.status === 200) {
        setUserInfo(data.data);
        navigate("/");
      } else {
        console.error("Đăng nhập thất bại:", data);
        alert(data?.error || "Đăng nhập thất bại");
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
        navigate("/");
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
    password: any
  ) => {
    try {
      const res = await postRegisterWeb(name, phone, email, password);
      if (res.status === 200) {
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  const handlePostDecodeToken = async (token: any) => {
    try {
      const res = await postDecodeToken(token);
      if(res.status === 200) {
        setUserInfo(res.data);
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
        handlePostLoginGoogle,
        handlePostLoginWeb,
        handlePostRegisterWeb,
        handlePostDecodeToken
      }}
    >
      {children}
    </AuthContexts.Provider>
  );
};

// Hook tiện lợi để dùng context
export const AuthContext = (): AuthContextType => {
  const context = useContext(AuthContexts);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
