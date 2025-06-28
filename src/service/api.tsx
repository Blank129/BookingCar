import axios from "axios";
import axiosApiInstance from "./axios";

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

export const postLoginGoogle = async (id_token: string) => {
  try {
    const response: any = await axiosApiInstance.post(`/auth/google`, {
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
  password: any, 
  role: string = 'user',
  driverInfo?: any
) => {
  try {
    const payload: any = {
      name, 
      phone, 
      email, 
      password,
      role
    };

    if (role === 'driver' && driverInfo) {
      payload.driverInfo = driverInfo;
    }

    const response: any = await axiosApiInstance.post(`/auth/register`, payload);
    return response;
  } catch (error) {
    console.log("lỗi postRegisterWeb", error);
    return error;
  }
};

export const postLoginWeb = async (email: any, password: any, role: string = 'user') => {
  try {
    const response: any = await axiosApiInstance.post(`/auth/login`, {
       email, 
       password,
       role
    });
    return response;
  } catch (error: any) {
    console.log("lỗi postLoginWeb", error.response.data.error);
    return error.response.data.error;
  }
};

export const postDecodeToken = async (token: any) => {
  try {
    const response: any = await axiosApiInstance.post(`/auth/decode`, {
       token
    });
    return response;
  } catch (error) {
    console.log("lỗi decode", error);
    return error;
  }
};

export const postRoute = async (
  pickup: [number, number],
  destination: [number, number]
) => {
  try {
    const response: any = await axiosApiInstance.post(`/route/path`, {
      pickup,
      destination,
    });
    return response.data.coordinates;
  } catch (error) {
    console.log("lỗi postRouter", error);
    return error;
  }
};

export const getRouteDistance = async (start: [number, number], end: [number, number]
): Promise<number> => {
  try {
    const res = await axiosApiInstance.post("/route/distance", {
      start,
      end,
    });

    return res.data.distanceKm;
  } catch (error) {
    console.error("Lỗi khi gọi backend ORS:", error);
    return 1;
  }
};