import axiosApiInstance from "./axios";

export const postRoute = async (
  pickup: [number, number],
  destination: [number, number]
) => {
  try {
    const response: any = await axiosApiInstance.post(`/route`, {
      pickup,
      destination,
    });
    return response.data.coordinates;
  } catch (error) {
    console.log("lỗi postRouter", error);
    return error;
  }
};
