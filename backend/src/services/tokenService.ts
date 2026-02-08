import jwt from "jsonwebtoken";

export interface ITokenService {
  createToken(userId: string, role: string): Promise<string>;
}

export class TokenService implements ITokenService {
  async createToken(userId: string, role: string): Promise<string> {
    const payload = {
      userId,
      role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15d",
    });

    return token;
  }
}
