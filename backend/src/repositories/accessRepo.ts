import { db } from "../config/firebase/firebaseConfig";
import { AccessCode } from "../models/accessCode";

export interface IAccessRepo {
  add(accessCode: AccessCode): Promise<AccessCode | null>;
  findByCode(otp: string, target: string): Promise<AccessCode | null>;
  updateStatus(otp: string, target: string): Promise<void>;
}

export class AccessRepo implements IAccessRepo {
  private accessCodes = db.collection("accessCode");

  async add(accessCode: AccessCode): Promise<AccessCode | null> {
    const ref = await this.accessCodes.add(accessCode);
    return {
      ...accessCode,
      target: ref.code,
    };
  }

  async findByCode(otp: string, target: string): Promise<AccessCode | null> {
    const snap = await this.accessCodes
      .where("code", "==", otp)
      .where("target", "==", target)
      .limit(1)
      .get();

    if (snap.empty) return null;

    return snap.docs[0].data() as AccessCode;
  }

  async updateStatus(otp: string, target: string): Promise<void> {
    const snap = await this.accessCodes
      .where("code", "==", otp)
      .where("target", "==", target)
      .limit(1)
      .get();

    if (snap.empty) return;

    await snap.docs[0].ref.update({
      flag: true,
    });
  }
}
