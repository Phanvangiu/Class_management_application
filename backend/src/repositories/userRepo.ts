import { db } from "../config/firebase/firebaseConfig";
import { User } from "../models/user";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

export interface IUserRepo {
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByUserId(userId: string): Promise<User | null>;
  add(userCreate: User): Promise<User | null>;
  getStudents(
    page: number,
    limit: number,
    instructorId: string,
  ): Promise<{ students: User[]; total: number }>;

  updateUser(user: User, userId: string): Promise<User | null>;
  deleteStudent(studentId: string): Promise<User>;
}

export class UserRepo implements IUserRepo {
  private users = db.collection("users");
  async deleteStudent(studentId: string): Promise<User> {
    const user = await this.findByUserId(studentId);

    if (!user) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    if (user.role !== "student") {
      throw new Error(
        `User ${studentId} is not a student (role: ${user.role})`,
      );
    }

    try {
      let docId: string | null = null;

      try {
        const docSnap = await this.users.doc(studentId).get();
        if (docSnap.exists) {
          docId = studentId;
        }
      } catch (err) {}

      if (!docId) {
        const snap = await this.users
          .where("userId", "==", studentId)
          .limit(1)
          .get();
        if (!snap.empty) {
          docId = snap.docs[0].id;
        }
      }

      if (!docId) {
        const snap = await this.users
          .where("phone", "==", studentId)
          .limit(1)
          .get();
        if (!snap.empty) {
          docId = snap.docs[0].id;
        }
      }

      if (!docId) {
        const snap = await this.users
          .where("email", "==", studentId)
          .limit(1)
          .get();
        if (!snap.empty) {
          docId = snap.docs[0].id;
        }
      }

      if (!docId) {
        throw new Error(`Could not find document ID for student ${studentId}`);
      }

      await this.users.doc(docId).update({
        isActive: false,
        deletedAt: new Date().toISOString(),
      });

      const updatedDocSnap = await this.users.doc(docId).get();
      const updatedUser = updatedDocSnap.data() as User;

      return updatedUser;
    } catch (error: any) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<User | null> {
    try {
      const docSnap = await this.users.doc(userId).get();
      if (docSnap.exists) {
        const userData = docSnap.data() as User;

        return userData;
      }
    } catch (err) {}

    let snap = await this.users.where("userId", "==", userId).limit(1).get();
    if (!snap.empty) {
      const userData = snap.docs[0].data() as User;
      return userData;
    }

    snap = await this.users.where("phone", "==", userId).limit(1).get();
    if (!snap.empty) {
      const userData = snap.docs[0].data() as User;
      return userData;
    }

    snap = await this.users.where("email", "==", userId).limit(1).get();
    if (!snap.empty) {
      const userData = snap.docs[0].data() as User;
      return userData;
    }

    return null;
  }
  async updateUser(user: User, userId: string): Promise<User | null> {
    const oldRef = this.users.doc(userId);
    const snap = await oldRef.get();

    if (!snap.exists) return null;

    const oldData = snap.data() as User;

    if (user.email !== oldData.email) {
      const newRef = this.users.doc(user.email);
      const batch = db.batch();

      batch.set(newRef, {
        ...user,
        userId: user.email,
      });

      batch.delete(oldRef);

      await batch.commit();

      const updated = await newRef.get();
      return updated.data() as User;
    } else {
      await oldRef.set(user, { merge: true });

      const updated = await oldRef.get();
      return updated.data() as User;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const snap = await this.users.where("email", "==", email).limit(1).get();

    if (snap.empty) return null;
    return snap.docs[0].data() as User;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const snap = await this.users.where("phone", "==", phone).limit(1).get();

    if (snap.empty) return null;
    return snap.docs[0].data() as User;
  }

  async add(userCreate: User): Promise<User | null> {
    try {
      await this.users.doc(userCreate.userId).set(userCreate);

      const doc = await this.users.doc(userCreate.userId).get();
      if (!doc.exists) return null;

      return doc.data() as User;
    } catch (error) {
      console.error("Error adding user:", error);
      return null;
    }
  }

  async getStudents(
    page = 1,
    limit = 1,
    instructorId: string,
  ): Promise<{ students: User[]; total: number; page: number }> {
    const offset = (page - 1) * limit;

    const query = this.users
      .where("role", "==", "student")
      .where("createdBy", "==", instructorId)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset(offset);

    const snapshot = await query.get();

    const students = snapshot.docs.map(
      (d: QueryDocumentSnapshot) => d.data() as User,
    );

    const totalSnapshot = await this.users
      .where("role", "==", "student")
      .where("createdBy", "==", instructorId)
      .where("isActive", "==", true)
      .get();

    return {
      students,
      total: totalSnapshot.size,
      page: page,
    };
  }
}
