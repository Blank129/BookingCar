import { axiosApiDriverInstance } from "./axios";

export const getCars = async () => {
  try {
    const response: any = await axiosApiDriverInstance.get(`/cars`);
    return response;
  } catch (error) {
    console.log("lỗi getCars", error);
    return error;
  }
};

export const postRegisterDriver = async (name: any, phone: any,id_type_car: any, drive_license_number: any, plate_license: any, email: any, password: any) => {
  try {
    const response: any = await axiosApiDriverInstance.post(`/auth/register`, {
      name, phone,id_type_car, drive_license_number, plate_license, email, password
    });
    return response;
  } catch (error) {
    console.log("lỗi postRegisterDriver", error);
    return error;
  }
};

export const postLoginDriver = async (email: any, password: any) => {
  try {
    const response: any = await axiosApiDriverInstance.post(`/auth/login`, {
       email, password
    });
    return response;
  } catch (error: any) {
    console.log("lỗi postRegisterDriver", error.response.data.error);
    return error.response.data.error;
  }
};

export const updateOnlineStatus = async (driver_id: any, isOnline: boolean, lat?: number, lng?: number) => {
  try {
    const res = await axiosApiDriverInstance.post('/status', {
      driver_id,
      is_online: isOnline,
      lat,
      lng
    });
    return res;
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái tài xế:', err);
  }
};

export const getBookings = async (id_type_car: any) => {
  try {
    const response: any = await axiosApiDriverInstance.get(`/bookings/${id_type_car}`);
    return response;
  } catch (error) {
    console.log("lỗi getBookings", error);
    return error;
  }
};

export const postApproveBooking = async (id_booking: any, id_driver: any) => {
  try {
    const response: any = await axiosApiDriverInstance.post(`/approve`, {
       id_booking, id_driver
    });
    return response;
  } catch (error: any) {
    console.log("lỗi postApproveBooking", error.response.data.error);
    return error.response.data.error;
  }
};