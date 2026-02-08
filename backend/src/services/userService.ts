import { User } from "../models/user";
import { IUserRepo } from "../repositories/userRepo";

export interface IUserService {
  getByEmail(email: string): Promise<User | null>;
  getByPhone(phone: string): Promise<User | null>;
  getByUserId(userId: string): Promise<User | null>;
  add(userCraete: User): Promise<User | null>;
  getStudents(
    page: number,
    limit: number,
    instructorId: string,
  ): Promise<{ students: User[]; total: number }>;
  updateUser(user: User, userId: string): Promise<User | null>;
  deleteStudent(studentId: string): Promise<User>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepo) {}
  async deleteStudent(studentId: string): Promise<User> {
    return this.userRepo.deleteStudent(studentId);
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email);
  }
  async getByPhone(phone: string): Promise<User | null> {
    return await this.userRepo.findByPhone(phone);
  }
  async getByUserId(userId: string): Promise<User | null> {
    return await this.userRepo.findByUserId(userId);
  }
  async add(userCraete: User): Promise<User | null> {
    return await this.userRepo.add(userCraete);
  }
  async getStudents(
    page: number,
    limit: number,
    instructorId: string,
  ): Promise<{ students: User[]; total: number }> {
    return this.userRepo.getStudents(page, limit, instructorId);
  }
  async updateUser(user: User, userId: string): Promise<User | null> {
    return this.userRepo.updateUser(user, userId);
  }
}
