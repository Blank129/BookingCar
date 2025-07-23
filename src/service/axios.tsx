import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const axiosApiUserInstance = axios.create({
  baseURL: `${BASE_URL}/user`,
});

export const axiosApiDriverInstance = axios.create({
  baseURL: `${BASE_URL}/driver`,
});

//http://localhost:5000
//https://booking-car-be.vercel.app