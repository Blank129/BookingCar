import React, { createContext, useContext, ReactNode, useState } from "react";
import { postLoginGoogle } from "../service/api";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
    userInfo: any;
    handlePostLoginGoogle: any;
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
        console.log("🎉 Đăng nhập thành công:", data);
        setUserInfo(data.data);
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        console.error("❌ Đăng nhập thất bại:", data);
        alert(data?.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("❌ Lỗi fetch tới backend:", error);
      alert("Có lỗi khi gọi backend");
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthContexts.Provider value={{ userInfo, handlePostLoginGoogle }}>{children}</AuthContexts.Provider>;
};

// Hook tiện lợi để dùng context
export const AuthContext = (): AuthContextType => {
  const context = useContext(AuthContexts);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
