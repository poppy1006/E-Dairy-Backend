import { prisma } from "../../prisma";
import { Request } from "express";
import ApiError from "../../helper/classes/api-error";
import { decodeJwt } from "./helper";

// ==========================================GET ADMINS========================================== //

export const getAdmin = async (req: Request) => {
  const token = req.headers["x-access-token"];
  if (!token) return false;
  const decoded = decodeJwt(token as string);
  const data = decoded as TokenPayload;
  if (!data) return false;

  const admin = await prisma.admin.findUnique({
    where: {
      id: data.id,
    },
  });
  if (!admin) return false;

  if (!admin.active)
    throw new ApiError(
      "Your account has been restricted by the administrator."
    );

  if (admin.role === "INSTITUTION_ADMIN" && admin.institution_id)
    req["institution_admin"] = admin;
  else if (admin.role === "SUPER_ADMIN" && admin.institution_id == null)
    req["super_admin"] = admin;

  return true;
};

// ==========================================GET STUDENT========================================== //

export const getStudent = async (req: Request) => {
  const token = req.headers["x-access-token"];

  if (!token) return false;

  const decoded = decodeJwt(token as string);
  const data = decoded as TokenPayload;
  if (!data) return false;
  const student = await prisma.student.findUnique({
    where: { id: data.id },
  });

  if (!student) return false;

  req["student"] = student;
  return true;
};
