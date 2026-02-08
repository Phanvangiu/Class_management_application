import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.route";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import lessonRouter from "./routes/lesson.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/lesson", lessonRouter);
export default app;
