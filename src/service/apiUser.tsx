import axios from "axios";
import { axiosApiUserInstance } from "./axios";

//----------------Auth--------------
export const postLoginGoogle = async (id_token: string) => {
  try {
    const response: any = await axiosApiUserInstance.post(`/auth/google`, {
      id_token,
    });
    return response;
  } catch (error) {
    console.log("lỗi postRouter", error);
    return error;
  }
};

export const postRegisterWeb = async (
  name: any,
  phone: any,
  email: any,
  password: any
) => {
  try {
    const response: any = await axiosApiUserInstance.post(`/auth/register`, {
      name,
      phone,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log("lỗi postRegisterWeb", error);
    return error;
  }
};

export const postLoginWeb = async (email: any, password: any) => {
  try {
    const response: any = await axiosApiUserInstance.post(`/auth/login`, {
      email,
      password,
    });
    return response;
  } catch (error: any) {
    console.log("lỗi postLoginWeb", error.response.data.error);
    return error.response.data.error;
  }
};

export const postDecodeToken = async (token: any) => {
  try {
    const response: any = await axiosApiUserInstance.post(`/auth/decode`, {
      token,
    });
    return response;
  } catch (error) {
    console.log("lỗi decode", error);
    return error;
  }
};

//-----------Map and Route-------------------
export const getLocationData = async (query: string, signal?: AbortSignal) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 8,
        countrycodes: "vn",
      },
      headers: {
        "Accept-Language": "vi",
      },
      signal,
    }
  );

  return response.data;
};

export const postRoute = async (
  pickup: [number, number],
  destination: [number, number]
) => {
  try {
    const response: any = await axiosApiUserInstance.post(`/route/path`, {
      pickup,
      destination,
    });
    return response.data.coordinates;
  } catch (error) {
    console.log("lỗi postRouter", error);
    return error;
  }
};

export const getRouteDistance = async (
  start: [number, number],
  end: [number, number]
): Promise<number> => {
  try {
    const res = await axiosApiUserInstance.post("/route/distance", {
      start,
      end,
    });

    return res.data.distanceKm;
  } catch (error) {
    console.error("Lỗi khi gọi backend ORS:", error);
    return 1;
  }
};

export const postBookingCar = async (
  id_user: any,
  id_type_car: any,
  location_from: any,
  location_to: any,
  location_from_name: any,
  location_to_name: any,
  distance: any,
  total_price: any
) => {
  try {
    const response: any = await axiosApiUserInstance.post(`/route/booking`, {
      id_user,
      id_type_car,
      location_from,
      location_to,
      location_from_name,
      location_to_name,
      distance,
      total_price,
    });
    return response;
  } catch (error) {
    console.log("lỗi postBookingCar", error);
    return error;
  }
};
