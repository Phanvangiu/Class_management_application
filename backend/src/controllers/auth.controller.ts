import { Request, Response } from "express";
import { IAuthService } from "../services/authService";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}
  async loginStudent(req: Request, res: Response) {
    const loginDto = req.body;
    if (loginDto.email == null) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Email required",
      });
    }

    const accessCode = await this.authService.loginStudent(loginDto);
    if (!accessCode) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Faild",
      });
    }
    return res.status(200).json({
      status: 200,
      data: {
        otp: accessCode.code,
        target: accessCode.target,
      },
      message: "OTP sent successfully",
    });
  }
  async loginInstructor(req: Request, res: Response) {
    const loginDto = req.body;

    if (!loginDto.phone) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Phone is required",
      });
    }

    const accessCode = await this.authService.loginInstructor(loginDto);

    if (!accessCode) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Create OTP failed",
      });
    }

    return res.status(200).json({
      status: 200,
      data: {
        otp: accessCode.code,
        target: accessCode.target,
      },
      message: "OTP sent successfully",
    });
  }

  async verifyOtp(req: Request, res: Response) {
    const verifyOtp = req.body;

    if (verifyOtp.target == null || verifyOtp.otp == null) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "UserId or opt required",
      });
    }
    const token = await this.authService.verifyOtp(verifyOtp);
    if (!token) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Create token failed",
      });
    }

    return res.status(200).json({
      status: 200,
      data: token,
      message: "Login success!",
    });
  }
}
