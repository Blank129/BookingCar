import axios from "axios";

export const axiosApiUserInstance = axios.create({
  baseURL: "https://booking-car-be.vercel.app/api/user",
});

export const axiosApiDriverInstance = axios.create({
  baseURL: "https://booking-car-be.vercel.app/api/driver",
});

//http://localhost:5000
//https://booking-car-be.vercel.app