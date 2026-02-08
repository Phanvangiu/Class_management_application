import { UserRepo } from "../repositories/userRepo";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/userService";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/authService";
import { AccessRepo } from "../repositories/accessRepo";
import { AccessService } from "../services/accessService";
import { TokenService } from "../services/tokenService";
import { LessonRepo } from "../repositories/lessonRepo";
import { LessonService } from "../services/lessonService";
import { LessonController } from "../controllers/lesson.controller";

const userRepo = new UserRepo();
const accessRepo = new AccessRepo();
const lessonRepo = new LessonRepo();

const userService = new UserService(userRepo);
const accessService = new AccessService(accessRepo);
const lessonService = new LessonService(lessonRepo);
const tokenService = new TokenService();

const userController = new UserController(userService);
const lessonController = new LessonController(lessonService);
const authService = new AuthService(accessService, tokenService, userService);
const authController = new AuthController(authService);

export { userController, authController, lessonController };
