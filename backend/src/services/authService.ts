import bcrypt from "bcrypt";
import { IUserService } from "./userService";
import { LoginDto } from "../dto/loginDto";
import { AccessCode } from "../models/accessCode";
import { IAccessService } from "./accessService";
import { ITokenService } from "./tokenService";
import { VerifyOtp } from "../dto/verifyOtp";
import { Timestamp } from "firebase-admin/firestore";
import { sendEmailService } from "./sendMailService";

export interface IAuthService {
  loginInstructor(login: LoginDto): Promise<AccessCode | null>;
  loginStudent(login: LoginDto): Promise<AccessCode | null>;
  verifyOtp(verifyOtp: VerifyOtp): Promise<Object | null>;
}
export class AuthService implements IAuthService {
  constructor(
    private readonly accessService: IAccessService,
    private readonly tokenService: ITokenService,
    private readonly userService: IUserService,
  ) {}

  async loginInstructor(loginDto: LoginDto): Promise<AccessCode | null> {
    const user = await this.userService.getByPhone(loginDto.phone!);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const accessCode = await this.accessService.add(user.userId);
    await sendEmailService.sendAccessEmail(user.email, accessCode.code);

    return accessCode;
  }
  async loginStudent(login: LoginDto): Promise<AccessCode | null> {
    const user = await this.userService.getByEmail(login.email!);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(login.password!, user.passwordHash!);
    console.log(isMatch);
    if (!isMatch) {
      throw new Error("Invalid credentials p");
    }
    const accessCode = await this.accessService.add(user.email);
    await sendEmailService.sendAccessEmail(user.email, accessCode.code);
    return accessCode;
  }

  async verifyOtp(verifyOtp: VerifyOtp): Promise<Object | null> {
    const access = await this.accessService.findByCode(
      verifyOtp.otp,
      verifyOtp.target,
    );

    if (!access || access.expiredAt < Timestamp.now() || access.flag == true) {
      return null;
    }

    var user = null;
    var createToken = null;

    if (verifyOtp.target.includes("@")) {
      user = await this.userService.getByEmail(verifyOtp.target);
      createToken = await this.tokenService.createToken(
        access.target,
        user?.role!,
      );
    } else {
      user = await this.userService.getByPhone(verifyOtp.target);
      createToken = await this.tokenService.createToken(
        access.target,
        user?.role!,
      );
    }

    await this.accessService.updateStatus(verifyOtp.otp, verifyOtp.target);

    return {
      token: createToken,
      user: user,
    };
  }
}
