import { AuthRequest } from "./../middlewares/auth.middleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { IUserService } from "../services/userService";
import { User } from "../models/user";
import { Timestamp } from "firebase-admin/firestore";
import { sendEmailService } from "../services/sendMailService";

export class UserController {
  constructor(private readonly userService: IUserService) {}
  async getByEmail(req: Request, res: Response) {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ Message: "Email requied" });
    }
    const user = await this.userService.getByEmail(String(email));
    if (!user) {
      return res.status(400).json({ Message: "Usernot found" });
    }
    return res.json(user);
  }
  async getByUserId(req: AuthRequest, res: Response) {
    const userId = req.user.userId;
    if (!userId)
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found",
      });
    const user = await this.userService.getByUserId(userId);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "User",
    });
  }
  async getByStudentIdIntructor(req: AuthRequest, res: Response) {
    const studentId = req.query.studentId as string;

    if (!studentId) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "studentId is required",
      });
    }
    const user = await this.userService.getByUserId(studentId);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "User",
    });
  }
  async updateStudentByInstructor(req: AuthRequest, res: Response) {
    try {
      const instructorId = req.user.userId;
      const submitData = req.body;

      if (!submitData || !submitData.userId) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Invalid request data",
        });
      }

      const studentData = await this.userService.getByUserId(submitData.userId);

      if (!studentData) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Student not found",
        });
      }

      if (studentData.createdBy !== instructorId) {
        return res.status(403).json({
          status: 403,
          data: null,
          message: "Permission denied",
        });
      }

      const updatedUser: User = {
        ...studentData,
        name: submitData.name || studentData.name,
        email: submitData.email || studentData.email,
        userId: submitData.email || studentData.email,
        phone: submitData.phone || studentData.phone,
        address:
          submitData.address !== undefined
            ? submitData.address
            : studentData.address,
      };

      const result = await this.userService.updateUser(
        updatedUser,
        submitData.userId,
      );

      return res.status(200).json({
        status: 200,
        data: result,
        message: "Update student successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        data: null,
        message: "Server error",
      });
    }
  }
  async setupProfile(req: Request, res: Response) {
    try {
      const { submitData, tokenSetup } = req.body;

      console.log("tokenSetup " + tokenSetup);
      let decoded: any;
      try {
        decoded = jwt.verify(tokenSetup, process.env.JWT_SECRET!);
      } catch (error) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Invalid or expired token",
        });
      }
      if (decoded.type !== "setup") {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Invalid token type",
        });
      }

      const userData = await this.userService.getByUserId(decoded.userId);

      if (!userData) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "User not found",
        });
      }

      if (userData.setupToken !== tokenSetup) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Token mismatch",
        });
      }

      if (userData.accountSetupCompleted) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Account already setup",
        });
      }

      if (!submitData.password) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Password is required",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(submitData.password, saltRounds);

      const updatedUser: User = {
        ...userData,
        name: submitData.name || userData.name,
        phone: submitData.phone || userData.phone,
        passwordHash: hashedPassword,
        address:
          submitData.address !== undefined
            ? submitData.address
            : userData.address,
        accountSetupCompleted: true,
        isActive: true,
        setupToken: "",
      };

      const result = await this.userService.updateUser(
        updatedUser,
        decoded.userId,
      );

      return res.status(200).json({
        status: 200,
        data: result,
        message: "Setup profile successfully",
      });
    } catch (error) {
      console.error("Error in setupProfile:", error);
      return res.status(500).json({
        status: 500,
        data: null,
        message: "Server error",
      });
    }
  }
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId as string;
      const user = await this.userService.getByUserId(userId);
      return res.status(200).json({
        status: 200,
        data: user,
        message: "User",
      });
    } catch (error) {}
  }
  async getProfileInstructor(req: AuthRequest, res: Response) {
    try {
      const userId = req.query.userId as string;
      const user = await this.userService.getByUserId(userId);
      return res.status(200).json({
        status: 200,
        data: user,
        message: "User",
      });
    } catch (error) {}
  }

  async createStudent(req: AuthRequest, res: Response) {
    const instructorId = req.user.userId;
    const { name, phone, email } = req.body;
    if (!name || !phone || !email)
      return res.json({
        status: 400,
        data: null,
        message: "Missing required fields",
      });
    const existingPhone = await this.userService.getByPhone(phone);

    if (existingPhone) {
      return res.json({
        status: 400,
        data: null,
        message: "Phone already exists ",
      });
    }
    const existingEmail = await this.userService.getByEmail(email);
    if (existingEmail) {
      return res.json({
        status: 400,
        data: null,
        message: "Email already exists ",
      });
    }
    const setupToken = jwt.sign(
      {
        userId: email,
        email: email,
        role: "student",
        type: "setup",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );
    const user: User = {
      userId: email,
      name: name,
      phone: phone,
      email: email,
      role: "student",
      address: "",
      createdBy: instructorId,
      setupToken: setupToken,
      accountSetupCompleted: false,
      isActive: true,
      createdAt: Timestamp.now(),
    };

    const userRef = await this.userService.add(user);
    await sendEmailService.sendLinkUpdate(user.email, setupToken, name);

    return res.json({
      status: 201,
      data: userRef?.userId!,
      message: "Create ",
    });
  }
  async getStudents(req: AuthRequest, res: Response) {
    const userId = req.user.userId;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const list = await this.userService.getStudents(page, limit, userId);

    return res.json({
      status: 200,
      data: list,
      message: userId,
    });
  }
  async deleteStudent(req: AuthRequest, res: Response) {
    const studentId = req.body.studentId;
    const instructorId = req.user.userId;
    const student = await this.userService.getByUserId(studentId);
    if (!student) {
      return res.json({
        status: 404,
        data: student,
        message: "Student not found",
      });
    }
    if (student.createdBy !== instructorId) {
      return res.json({
        status: 400,
        data: student,
        message: "No create by instructor",
      });
    }

    const result = await this.userService.deleteStudent(studentId);
    return res.json({
      status: 200,
      data: student,
      message: "Detele success!!!",
    });
  }
  async updateProfile(req: AuthRequest, res: Response) {
    const userId = req.user.userId;
    const data = req.body;

    const userData = await this.userService.getByUserId(userId);
    if (!userData) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found",
      });
    }

    if (!userData.passwordHash) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "User password hash is missing",
      });
    }

    let hashedPassword: string = userData.passwordHash;

    if (data.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(data.password, saltRounds);
    }

    const updatedUser: User = {
      ...userData,
      name: data.name ?? userData.name,
      phone: data.phone ?? userData.phone,
      passwordHash: hashedPassword,
      address: data.address !== undefined ? data.address : userData.address,
      accountSetupCompleted: true,
      isActive: true,
      setupToken: "",
    };

    const result = await this.userService.updateUser(updatedUser, userId);

    return res.status(200).json({
      status: 200,
      data: result,
      message: "Profile updated successfully",
    });
  }
}
