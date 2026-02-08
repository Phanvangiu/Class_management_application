import axiosClient from "../axiosClient";

export const getHistory = (otherUserId: string) =>
  axiosClient.get(`/api/chat/history/${otherUserId}`);

export const sendMessageApi = (data: { to: string; message: string }) =>
  axiosClient.post("/api/chat/send", data);
