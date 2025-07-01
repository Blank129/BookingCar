import axios from "axios";

export const axiosApiUserInstance = axios.create({
  baseURL: "http://localhost:5000/api/user",
});

export const axiosApiDriverInstance = axios.create({
  baseURL: "http://localhost:5000/api/driver",
});