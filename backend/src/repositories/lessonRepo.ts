import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../config/firebase/firebaseConfig";
import { Lesson } from "../models/lesson";
export interface ILessonRepo {
  add(lesson: Lesson): Promise<Lesson | null>;
  getByInstructorDistinct(instructorId: string): Promise<Lesson[]>;
  getByInstructorLessonCode(
    instructorId: string,
    lessonCode: string,
  ): Promise<Lesson[]>;
  getLessonByStudent(studentId: string): Promise<Lesson[]>;
  finshLesson(studentId: string, lessonCode: string): Promise<Lesson>;
}
export class LessonRepo implements ILessonRepo {
  private lessons = db.collection("lessons");

  async add(lesson: Lesson): Promise<Lesson | null> {
    const docRef = this.lessons.doc();

    const newLesson: Lesson = {
      ...lesson,
      id: docRef.id,
    };

    await docRef.set(newLesson);

    return newLesson;
  }
  async finshLesson(studentId: string, lessonCode: string): Promise<Lesson> {
    const snap = await this.lessons
      .where("assignedTo", "==", studentId)
      .where("lessonCode", "==", lessonCode)
      .get();

    if (snap.empty) {
      throw new Error("Lesson not found");
    }

    const doc = snap.docs[0];

    await doc.ref.update({
      status: "done",
    });

    return {
      ...(doc.data() as Lesson),
      id: doc.id,
      status: "done",
    };
  }

  async getByInstructorDistinct(instructorId: string): Promise<Lesson[]> {
    const snap = await this.lessons
      .where("assignedBy", "==", instructorId)
      .orderBy("createdAt", "desc")
      .get();

    const map = new Map<string, Lesson>();

    snap.docs.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as Lesson;

      if (!map.has(data.lessonCode)) {
        map.set(data.lessonCode, {
          ...data,
          id: doc.id,
        });
      }
    });

    return Array.from(map.values());
  }

  async getLessonByStudent(studentId: string): Promise<Lesson[]> {
    console.log("getLessonByStudent REPO  " + studentId);
    const snap = await this.lessons
      .where("assignedTo", "==", studentId)
      .orderBy("createdAt", "desc")
      .get();
    console.log("getLessonByStudent REPO snap  " + snap);

    const map = new Map<string, Lesson>();

    snap.docs.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as Lesson;

      if (!map.has(data.lessonCode)) {
        map.set(data.lessonCode, {
          ...data,
          id: doc.id,
        });
      }
    });

    return Array.from(map.values());
  }

  async getByInstructorLessonCode(
    instructorId: string,
    lessonCode: string,
  ): Promise<Lesson[]> {
    const snap = await this.lessons
      .where("assignedBy", "==", instructorId)
      .where("lessonCode", "==", lessonCode)
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map((doc: QueryDocumentSnapshot) => ({
      ...(doc.data() as Lesson),
      id: doc.id,
    }));
  }
}
