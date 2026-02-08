import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/author.middleware";
import { lessonController } from "../di/container";

const lessonRouter = Router();

lessonRouter.post(
  "/create",
  authenticate,
  authorize(["instructor"]),
  lessonController.addLesson.bind(lessonController),
);
lessonRouter.get(
  "/list_lesson",
  authenticate,
  authorize(["instructor"]),
  lessonController.getByInstructorDistinct.bind(lessonController),
);
lessonRouter.get(
  "/list_student_lesson",
  authenticate,
  authorize(["instructor"]),
  lessonController.getByInstructorLessonCode.bind(lessonController),
);

lessonRouter.get(
  "/list_lesson_of_student",
  authenticate,
  lessonController.getLessonByStudent.bind(lessonController),
);

lessonRouter.post(
  "/finish_lesson",
  authenticate,
  lessonController.finshLesson.bind(lessonController),
);
export default lessonRouter;
