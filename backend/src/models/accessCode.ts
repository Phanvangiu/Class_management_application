import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;

export interface AccessCode {
  target: string;
  code: string;
  flag: boolean;
  createdAt: Timestamp;
  expiredAt: Timestamp;
}
