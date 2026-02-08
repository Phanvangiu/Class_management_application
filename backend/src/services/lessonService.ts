import { Lesson } from "../models/lesson";
import { Timestamp } from "firebase-admin/firestore";
import { LessonRepo } from "../repositories/lessonRepo";

export interface ILessonService {
  add(
    instructorId: string,
    lesson: Lesson,
    studentIds: string[],
  ): Promise<Lesson[]>;
  getByInstructorDistinct(instructorId: string): Promise<Lesson[]>;
  getByInstructorLessonCode(
    instructorId: string,
    lessonCode: string,
  ): Promise<Lesson[]>;
  getLessonByStudent(studentId: string): Promise<Lesson[]>;
  finshLesson(studentId: string, lessonCode: string): Promise<Lesson>;
}

export class LessonService implements ILessonService {
  constructor(private readonly lessonRepo: LessonRepo) {}
  async finshLesson(studentId: string, lessonCode: string): Promise<Lesson> {
    return this.lessonRepo.finshLesson(studentId, lessonCode);
  }
  async getLessonByStudent(studentId: string): Promise<Lesson[]> {
    return await this.lessonRepo.getLessonByStudent(studentId);
  }
  async add(
    instructorId: string,
    lesson: Lesson,
    studentIds: string[],
  ): Promise<Lesson[]> {
    const results: Lesson[] = [];
    const lessonCode = `${Date.now()}`;
    for (const studentId of studentIds) {
      const newLesson: Lesson = {
        ...lesson,
        assignedBy: instructorId,
        assignedTo: studentId,
        lessonCode: lessonCode,
        createdAt: Timestamp.now(),
        expiredAt: lesson.expiredAt! ?? null,
        status: "pending",
      };

      const created = await this.lessonRepo.add(newLesson);

      if (created) results.push(created);
    }

    return results;
  }
  async getByInstructorDistinct(instructorId: string): Promise<Lesson[]> {
    return await this.lessonRepo.getByInstructorDistinct(instructorId);
  }
  async getByInstructorLessonCode(
    instructorId: string,
    lessonCode: string,
  ): Promise<Lesson[]> {
    return this.lessonRepo.getByInstructorLessonCode(instructorId, lessonCode);
  }
}
