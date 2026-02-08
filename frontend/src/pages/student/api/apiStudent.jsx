import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../../../shared/axiosClient";

const fetchInstructorById = async (instructorId) => {
  const res = await axiosClient.get(
    `api/user/profile_instructor?userId=${encodeURIComponent(instructorId)}`,
  );
  return res.data;
};

export const GetInstructorById = (instructorId) => {
  return useQuery({
    queryKey: ["instructor", instructorId],
    queryFn: () => fetchInstructorById(instructorId),
    enabled: !!instructorId,
    retry: 1,
  });
};

const fetchLessonsByStudent = async () => {
  const res = await axiosClient.get("api/lesson/list_lesson_of_student");
  return res.data;
};
export const GetLessonsByStudent = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: () => fetchLessonsByStudent(),
  });
};

export const FinishLesson = () => {
  const finishLesson = async (payload) => {
    const response = await axiosClient.post(
      "/api/lesson/finish_lesson",
      payload,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: finishLesson,
  });
};

export const SetupProfileFirst = () => {
  const request = async ({ submitData, tokenSetup }) => {
    const response = await axiosClient.post("/api/user/setup_profile", {
      submitData,
      tokenSetup,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const UpdateProfile = () => {
  const request = async ({ payload }) => {
    const response = await axiosClient.post(
      "/api/user/update_profile",
      payload,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
