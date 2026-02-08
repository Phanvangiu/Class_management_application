import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    return decoded as {
      userId: string;
      role: "instructor" | "student";
      iat?: number;
      exp?: number;
    };
  } catch (error: any) {
    return null;
  }
};
