import { Router } from "express";
import { userController } from "../di/container";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/author.middleware";

const userRouter = Router();
userRouter.post(
  "/create",
  authenticate,
  authorize(["instructor"]),
  userController.createStudent.bind(userController),
);
userRouter.get(
  "/student_list",
  authenticate,
  authorize(["instructor"]),
  userController.getStudents.bind(userController),
);
userRouter.get(
  "/get_student",
  authenticate,
  authorize(["instructor"]),
  userController.getByStudentIdIntructor.bind(userController),
);
userRouter.get(
  "/profile",
  authenticate,
  userController.getProfile.bind(userController),
);
userRouter.get(
  "/profile_instructor",
  authenticate,
  userController.getProfileInstructor.bind(userController),
);
userRouter.post(
  "/update_profile",
  authenticate,
  userController.updateProfile.bind(userController),
);
userRouter.post(
  "/update_student",
  authenticate,
  authorize(["instructor"]),
  userController.updateStudentByInstructor.bind(userController),
);
userRouter.post(
  "/delete_student",
  authenticate,
  authorize(["instructor"]),
  userController.deleteStudent.bind(userController),
);
userRouter.post("/setup_profile", (req, res) =>
  userController.setupProfile(req, res),
);

export default userRouter;
