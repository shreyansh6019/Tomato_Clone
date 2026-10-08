import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { IUser } from "../types/IUser.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authorization header missing or malformed" });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token missing" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || !decoded.user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = decoded.user as IUser;
    next();
  } catch (err) {
    console.error("Error in isAuth middleware:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuth;


export const isSeller = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { user } = req;

  if(user && user.role !== "seller") {
    res.status(401).json({ message: "Unauthorized" });
    return 
  }
  next();
};