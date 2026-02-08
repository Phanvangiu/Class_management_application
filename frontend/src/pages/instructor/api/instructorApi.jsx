import axiosClient from "../../../shared/axiosClient";
import qs from "qs";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchLessons = async () => {
  const res = await axiosClient.get("api/lesson/list_lesson");
  return res.data;
};
export const GetLessons = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: () => fetchLessons(),
  });
};

const fetchLessonStudentList = async (lessonCode) => {
  const res = await axiosClient.get("api/lesson/list_student_lesson", {
    params: { lessonCode },
  });
  return res.data;
};
export const GetLessonStudents = (lessonCode) => {
  return useQuery({
    queryKey: ["lesson_student", lessonCode],
    queryFn: () => fetchLessonStudentList(lessonCode),
  });
};
const fetchStudents = async (page, limit) => {
  const res = await axiosClient.get("api/user/student_list", {
    params: { page, limit },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });

  return res.data;
};

export const GetStudents = (page, limit) => {
  return useQuery({
    queryKey: ["students", page, limit],
    queryFn: () => fetchStudents(page, limit),
    keepPreviousData: true,
  });
};
const fetchStudentById = async (studentId) => {
  const res = await axiosClient.get("api/user/get_student", {
    params: { studentId },
  });
  return res.data;
};

export const GetStudentById = (studentId) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => fetchStudentById(studentId),
    enabled: !!studentId,
  });
};
export const CreateStudent = () => {
  const createStudent = async (payload) => {
    const response = await axiosClient.post("/api/user/create", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: createStudent,
  });
};

export const UpdateStudent = () => {
  const updateStudent = async (payload) => {
    const response = await axiosClient.post(
      "/api/user/update_student",
      payload,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updateStudent,
  });
};

export const DeleteStudent = () => {
  const request = async (payload) => {
    const response = await axiosClient.post(
      "/api/user/delete_student",
      payload,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const AddLesson = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("/api/lesson/create", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
