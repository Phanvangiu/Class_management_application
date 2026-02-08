import { createBrowserRouter, Navigate } from "react-router-dom";
import InstructorLayout from "../shared/layout/InstructorLayout";
import StudentLayout from "../shared/layout/StudentLayout";
import ProtectedRoute from "../shared/components/ProtectedRoute";

import ChatPage from "../pages/chat/ChatPage";

import InstructorLogin from "../pages/instructor/InstructorLogin";
import StudentLogin from "../pages//student/StudentLogin";

import InstructorCourses from "../pages/instructor/Courses";
import InstructorStudents from "../pages/instructor/Students";
import StudentSetup from "./components/StudentSetup";

import StudentCourses from "../pages/student/MyCourses";

import LandingPage from "../shared/components/LandingPage";
import StudentChatPage from "../pages/student/StudentChatPage";
import LessonPage from "../pages/instructor/Lesson/LessonPage";
import StudentLessonPage from "../pages/student/lesson/StudentLessonPage";
import Profile from "../pages/student/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/instructor/login",
    element: <InstructorLogin />,
  },
  {
    path: "/student/login",
    element: <StudentLogin />,
  },
  {
    path: "/student/setup",
    element: <StudentSetup />,
  },
  {
    path: "/instructor",
    element: (
      <ProtectedRoute requiredRole="instructor">
        <InstructorLayout />
      </ProtectedRoute>
    ),
    children: [
      // ✅ Default redirect to lessonx
      { index: true, element: <Navigate to="lesson" replace /> },
      { path: "lesson", element: <LessonPage /> },
      { path: "chat", element: <ChatPage /> },
      {
        path: "courses",
        element: <InstructorCourses />,
      },
      {
        path: "students",
        element: <InstructorStudents />,
      },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute requiredRole="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="lesson" replace /> },
      { path: "lesson", element: <StudentLessonPage /> },
      { path: "profile", element: <Profile /> },
      {
        path: "chat",
        element: <StudentChatPage />,
      },
      {
        path: "courses",
        element: <StudentCourses />,
      },
    ],
  },
]);

export default router;
