import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings, getCars } from "../service/apiDriver";
import { getBookingCars } from "../service/apiUser";

type CarContextType = {
  cars: any[];
  listBookings: any[];
  handleGetListBooking: any;
  bookingUser: any[];
  setBookingUser: any;
  handleGetBookingUser: any;
};

const CarContexts = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cars, setCars] = useState([]);
  const [listBookings, setListBookings] = useState([]);
  const [bookingUser, setBookingUser] = useState([]);

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

  const handleGetBookingUser = async (id_user: any) => {
    try {
      const res = await getBookingCars(id_user);
      if (res.status === 200) {
        setBookingUser(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách booking user:", error);
    }
  }

  useEffect(() => {
    handleGetAllCars();
  },[])

  return (
    <CarContexts.Provider
      value={{
        cars,
        listBookings,
        handleGetListBooking,
        bookingUser,
        setBookingUser,
        handleGetBookingUser,
      }}
    >
      {children}
    </CarContexts.Provider>
  );
};

export const CarContext = (): CarContextType => {
  const context = useContext(CarContexts);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};