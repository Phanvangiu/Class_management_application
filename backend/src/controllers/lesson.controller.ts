import { Response } from "express";
import { ILessonService } from "../services/lessonService";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Lesson } from "../models/lesson";

export class LessonController {
  constructor(private readonly lessonService: ILessonService) {}

  async addLesson(req: AuthRequest, res: Response) {
    try {
      const instructorId = req.user.userId;

      const lesson: Lesson = req.body.lesson;
      const studentIds: string[] = req.body.studentIds;

      if (!lesson || !studentIds?.length) {
        return res.status(400).json({ message: "Invalid payload studentIds" });
      }

      const result = await this.lessonService.add(
        instructorId,
        lesson,
        studentIds,
      );

      return res.status(201).json({
        status: 200,
        data: result,
        message: "Total " + result.length + " record",
      });
    } catch (err) {
      console.error(err);
      return res.status(201).json({
        status: 200,
        data: null,
        message: "Add lesson faile",
      });
    }
  }
  async getByInstructorDistinct(req: AuthRequest, res: Response) {
    try {
      const instructorId = req.user.userId;
      const result =
        await this.lessonService.getByInstructorDistinct(instructorId);

      return res.status(200).json({
        status: 200,
        data: result,
        message: "Total " + result.length + " record",
      });
    } catch (error) {
      return res.status(500).json({
        status: 200,
        data: null,
        message: "Get lessons failed",
      });
    }
  }
  async getByInstructorLessonCode(req: AuthRequest, res: Response) {
    try {
      const instructorId = req.user.userId;
      if (!instructorId) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "ko có Id giảng viên",
        });
      }
      const lessonCode = req.query.lessonCode as string;
      if (!lessonCode) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "ko có lessonCode",
        });
      }
      const result = await this.lessonService.getByInstructorLessonCode(
        instructorId,
        lessonCode,
      );

      return res.status(200).json({
        status: 200,
        data: result,
        message: "Total " + result.length + " record",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        data: null,
        message: "Get lessons failed",
      });
    }
  }

  async getLessonByStudent(req: AuthRequest, res: Response) {
    try {
      const studentId = req.user.userId;
      console.log("getLessonByStudent  " + studentId);
      const result = await this.lessonService.getLessonByStudent(studentId);
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Total " + result.length + " record",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        data: null,
        message: "Get lessons failed",
      });
    }
  }
  async finshLesson(req: AuthRequest, res: Response) {
    try {
      const studentId = req.user.userId;
      const lessonCode = req.body.lessonCode as string;

      if (!lessonCode) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "lessonCode is required",
        });
      }

      const result = await this.lessonService.finshLesson(
        studentId,
        lessonCode,
      );

      return res.status(200).json({
        status: 200,
        data: result,
        message: "Lesson completed successfully",
      });
    } catch (error) {
      console.error("Error finishing lesson:", error);
      return res.status(500).json({
        status: 500,
        data: null,
        message: error instanceof Error ? error.message : "Update failed",
      });
    }
  }
}
