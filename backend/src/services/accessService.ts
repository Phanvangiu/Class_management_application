import { Timestamp } from "firebase-admin/firestore";
import { AccessCode } from "../models/accessCode";
import { IAccessRepo } from "../repositories/accessRepo";

export interface IAccessService {
  add(userId: string): Promise<AccessCode>;
  findByCode(otp: string, target: string): Promise<AccessCode | null>;
  updateStatus(otp: string, target: string): Promise<void>;
}

export class AccessService implements IAccessService {
  constructor(private readonly accessRepo: IAccessRepo) {}

  async add(userId: string): Promise<AccessCode> {
    const now = Timestamp.now();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const accessCode: AccessCode = {
      target: userId,
      code: otp,
      createdAt: now,
      expiredAt: Timestamp.fromMillis(now.toMillis() + 5 * 60 * 1000),
      flag: false,
    };

    await this.accessRepo.add(accessCode);
    return accessCode;
  }

  async findByCode(otp: string, target: string): Promise<AccessCode | null> {
    return await this.accessRepo.findByCode(otp, target);
  }
  async updateStatus(otp: string, target: string): Promise<void> {
    return await this.accessRepo.updateStatus(otp, target);
  }
}
