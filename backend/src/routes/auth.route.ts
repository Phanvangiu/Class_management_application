import { Router } from "express";
import { authController } from "../di/container";

const authRouter = Router();
authRouter.post("/login/instructor", (req, res) =>
  authController.loginInstructor(req, res),
);
authRouter.post("/login/student", (req, res) =>
  authController.loginStudent(req, res),
);

authRouter.post("/verify", (req, res) => authController.verifyOtp(req, res));

export default authRouter;
