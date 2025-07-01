import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../service/apiDriver";

type CarContextType = {
  cars: any[];
};

const CarContexts = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  const handleGetAllCars = async () => {
    try {
      const res = await getCars();
      if (res.status === 200) {
        setCars(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách xe:", error);
    }
  };

  useEffect(() => {
    handleGetAllCars();
  },[])

  return (
    <CarContexts.Provider
      value={{
        cars,
      }}
    >
      {children}
    </CarContexts.Provider>
  );
};

// Hook tiện lợi để dùng context
export const CarContext = (): CarContextType => {
  const context = useContext(CarContexts);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
