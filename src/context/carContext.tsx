import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings, getCars } from "../service/apiDriver";

type CarContextType = {
  cars: any[];
  listBookings: any[];
  handleGetListBooking: any
};

const CarContexts = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [listBookings, setListBookings] = useState([]);

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
  const handleGetListBooking = async (id_type_car: any) => {
    try {
      const res = await getBookings(id_type_car);
      if (res.status === 200) {
        setListBookings(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
    }
  };

  useEffect(() => {
    handleGetAllCars();
  },[])

  return (
    <CarContexts.Provider
      value={{
        cars,
        listBookings,
        handleGetListBooking
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