import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axiosClient";

export const useStudentLogin = () => {
  const studentLogin = async (payload) => {
    const response = await axiosClient.post("/api/auth/login/student", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: studentLogin,
  });
};

export const useStudentVerifyOTP = () => {
  const studentVerifyOTP = async (payload) => {
    const response = await axiosClient.post("/api/auth/verify", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: studentVerifyOTP,
  });
};

export const useInstructorLogin = () => {
  const instructorLogin = async (payload) => {
    try {
      const response = await axiosClient.post(
        "/api/auth/login/instructor",
        payload,
      );

      return response.data;
    } catch (error) {
      console.log("Error Data:", error.response?.data);
      throw error;
    }
  };

  return useMutation({
    mutationFn: instructorLogin,
  });
};

export const useInstructorVerifyOTP = () => {
  const instructorVerifyOTP = async (payload) => {
    const response = await axiosClient.post("/api/auth/verify", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: instructorVerifyOTP,
  });
};

export const useLogout = () => {
  const logout = async () => {
    const response = await axiosClient.post("/api/v1/auth/logout");
    return response.data;
  };

  return useMutation({
    mutationFn: logout,
  });
};
