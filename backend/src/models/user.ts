import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;
export type UserRole = "instructor" | "student";

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  accountSetupCompleted: boolean;
  setupToken?: string;
  address?: string;
  createdBy?: string;
  createdAt: Timestamp;
  isActive?: boolean;
}
