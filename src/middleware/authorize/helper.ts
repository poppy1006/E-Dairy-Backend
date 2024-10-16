import jwt, { Secret } from "jsonwebtoken";
import ApiError from "../../helper/classes/api-error";
import { Request } from "express";
import { getAdmin, getStudent } from "./db";

export const roleHandlers = {
  SUPER_ADMIN: getAdmin,
  INSTITUTION_ADMIN: getAdmin,
  STUDENT: getStudent,
};

export const loadUserByRole = async (role: Role, req: Request) => {
  const handler = roleHandlers[role];
  return await handler(req);
};

export const unAuthorizedException = () => {
  throw new ApiError("Unauthorized", 401);
};

export const decodeJwt = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as Secret);
  } catch (err: any) {
    console.log("jwt decode error", err.message);
    unAuthorizedException();
  }
};
