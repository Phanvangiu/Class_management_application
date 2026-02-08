import { db } from "../config/firebase/firebaseConfig";
import { ChatMessage } from "../models/chat";
import { firestore } from "firebase-admin";

export class ChatService {
  private messagesCollection = db.collection("messages");

  async saveMessage(
    from: string,
    to: string,
    message: string,
  ): Promise<ChatMessage> {
    const messageData = {
      from,
      to,
      message,
      createdAt: firestore.Timestamp.now(),
    };

    const docRef = await this.messagesCollection.add(messageData);

    return {
      id: docRef.id,
      ...messageData,
    };
  }

  private convertDocsToMessages(
    docs: firestore.QueryDocumentSnapshot[],
  ): ChatMessage[] {
    return docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
  }

  async getChatHistory(
    userId1: string,
    userId2: string,
    limit: number = 50,
  ): Promise<ChatMessage[]> {
    try {
      const query1 = await this.messagesCollection
        .where("from", "==", userId1)
        .where("to", "==", userId2)
        .orderBy("createdAt", "asc")
        .limit(limit)
        .get();

      const query2 = await this.messagesCollection
        .where("from", "==", userId2)
        .where("to", "==", userId1)
        .orderBy("createdAt", "asc")
        .limit(limit)
        .get();

      const messages1 = this.convertDocsToMessages(query1.docs);
      const messages2 = this.convertDocsToMessages(query2.docs);

      const allMessages = [...messages1, ...messages2].sort((a, b) => {
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      });

      return allMessages.slice(0, limit);
    } catch (error) {
      console.error("Error getting chat history:", error);
      throw error;
    }
  }

  async canUsersChatWithEachOther(
    userId1: string,
    role1: string,
    userId2: string,
    role2: string,
  ): Promise<boolean> {
    const allowPairs = [
      ["instructor", "student"],
      ["student", "instructor"],
    ];

    return allowPairs.some(([r1, r2]) => r1 === role1 && r2 === role2);
  }
  async canStudentChatWithInstructor(
    studentId: string,
    instructorId: string,
  ): Promise<boolean> {
    try {
      const studentDoc = await db.collection("users").doc(studentId).get();

      if (!studentDoc.exists) {
        return false;
      }

      const studentData = studentDoc.data();

      const instructorDoc = await db
        .collection("users")
        .doc(instructorId)
        .get();

      if (!instructorDoc.exists) {
        return false;
      }

      const instructorData = instructorDoc.data();

      const isMatch =
        studentData?.createdBy === instructorId ||
        studentData?.createdBy === instructorData?.phone ||
        studentData?.createdBy === instructorData?.userId;

      return isMatch;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getUserInfo(userId: string): Promise<{ role: string } | null> {
    try {
      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      return {
        role: userData?.role,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }
}

export const chatService = new ChatService();
