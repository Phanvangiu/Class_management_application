import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";
import { chatService } from "../services/chat.service";

const chatRouter = Router();

function getParamString(value: any): string | null {
  if (typeof value !== "string") return null;
  if (!value.trim()) return null;
  return value;
}

chatRouter.get(
  "/history/:otherUserId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      const param = getParamString(req.params.otherUserId);
      if (!param) {
        return res.status(400).json({ message: "otherUserId required" });
      }

      const limit = Number(req.query.limit) || 50;

      const messages = await chatService.getChatHistory(userId, param, limit);

      res.json({
        success: true,
        count: messages.length,
        messages: messages.map((m) => ({
          id: m.id,
          from: m.from,
          to: m.to,
          message: m.message,
          createdAt: m.createdAt.toMillis(),
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get history" });
    }
  },
);

chatRouter.post(
  "/send",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;

      const { to, message } = req.body;

      if (!to || !message) {
        return res.status(400).json({ message: "to & message required" });
      }

      if (!message.trim()) {
        return res.status(400).json({ message: "Message empty" });
      }

      const otherUser = await chatService.getUserInfo(to);
      if (!otherUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const canChat = await chatService.canUsersChatWithEachOther(
        userId,
        role,
        to,
        otherUser.role,
      );

      if (!canChat) {
        return res.status(403).json({
          message: "Only instructor can chat with student",
        });
      }

      if (role === "student" && otherUser.role === "instructor") {
        const canStudentChat = await chatService.canStudentChatWithInstructor(
          userId,
          to,
        );

        if (!canStudentChat) {
          return res.status(403).json({
            message: "You can only chat with your instructor",
          });
        }
      }

      const saved = await chatService.saveMessage(userId, to, message.trim());

      res.json({
        success: true,
        message: {
          id: saved.id,
          from: saved.from,
          to: saved.to,
          message: saved.message,
          createdAt: saved.createdAt.toMillis(),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Send failed" });
    }
  },
);

chatRouter.get(
  "/can-chat/:otherUserId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;

      const param = getParamString(req.params.otherUserId);
      if (!param) {
        return res.status(400).json({ message: "otherUserId required" });
      }

      const otherUser = await chatService.getUserInfo(param);
      if (!otherUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const canChat = await chatService.canUsersChatWithEachOther(
        userId,
        role,
        param,
        otherUser.role,
      );

      res.json({
        success: true,
        canChat,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Check failed" });
    }
  },
);

export default chatRouter;
