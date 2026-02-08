import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;

export type LessonStatus = "pending" | "done";

export interface Lesson {
  id: string;
  lessonCode: string;
  title: string;
  description: string;

  assignedBy: string;
  assignedTo: string;

  status: LessonStatus;

  createdAt: Timestamp;
  expiredAt?: Timestamp;
}
