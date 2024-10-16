import { NextFunction, Request, Response } from "express";
import { loadUserByRole, roleHandlers, unAuthorizedException } from "./helper";
import { Admin, Student } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    super_admin: Admin;
    institution_admin: Admin;
    student: Student;
  }
}

const authorize = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const role of Object.keys(roleHandlers) as Role[]) {
      if (roles.includes(role as Role)) {
        const result = await loadUserByRole(role, req);
        // console.log("role: ", role, result);
        if (result) break;
      }
    }

    const { super_admin, institution_admin, student } = req;
    if (!(super_admin || institution_admin || student)) {
      return unAuthorizedException();
    }

    next();
  };
};
export default authorize;
