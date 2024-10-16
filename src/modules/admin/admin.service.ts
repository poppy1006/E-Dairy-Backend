import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Authentication from "../../helper/classes/authentication";
import { prisma } from "../../prisma";
import ApiError from "../../helper/classes/api-error";
import excludeFields from "../../helper/functions/execludeFields";
import {
  ForgotPassword,
  ResetPassword,
  SignIn,
  VerifyOTP,
} from "../../validations/schema/auth";
import { Admin, Institutions } from "@prisma/client";
import { Request } from "express";
import generatePassword from "../../helper/functions/generatePassword";
import emails from "../../helper/functions/mailer";

const authentication = new Authentication(prisma.admin);

export async function signIn({ body }: SignIn) {
  const { email, password } = body;

  const user = await prisma.admin.findUnique({ where: { email } });
  if (!user) throw new ApiError("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new ApiError("Invalid email or password");

  if (!user.active)
    throw new ApiError(
      "Your account has been restricted by the administrator."
    );

  const token = jwt.sign(
    { id: user.id, email, name: user.name },
    process.env.JWT_SECRET as string
    // { expiresIn: this.jwt_expres_in } //TODO: uncomment this line
  );
  return { token, user };
}

// TODO: incl creating super admin if neccesary
export async function createInstitutionAdmin(body: Request["body"]) {
  const password = generatePassword();
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);

  const institution = await prisma.institutions.findUnique({
    where: { id: body.institution_id },
  });
  if (!institution)
    throw new ApiError("No Institution found with the specified id", 404);

  // checks for more than one admin from a institution
  if (
    await prisma.admin.findUnique({
      where: { institution_id: body.institution_id },
    })
  )
    throw new ApiError(
      "An admin from this institution already exists! No more than 1 admin from a single institution are allowed",
      400
    );
  const institution_admin = await prisma.admin.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashed_password,
      institution_id: body.institution_id,
      role: "INSTITUTION_ADMIN",
    },
  });

  // email login credentials to admin
  await emails.loginCredentials(
    institution_admin.email,
    institution_admin.name,
    password
  );

  return { admin: excludeFields(institution_admin, ["password", "otp"]) };
}

export async function getAdminInfo(admin: Admin) {
  return excludeFields(admin, ["password", "otp"]);
}

export async function forgotPassword({ body }: ForgotPassword) {
  if (!body.email) throw new ApiError("email is required");

  const user = await prisma.admin.findUnique({ where: { email: body.email } });
  if (!user) throw new ApiError("Invalid email", 400);

  if (!user.active)
    throw new ApiError(
      "Your account has been restricted by the administrator."
    );

  await authentication.forgotPassword(body.email);
  return { message: "OTP sent to admin" };
}

export async function verifyOtp({ body }: VerifyOTP) {
  const user = await prisma.admin.findUnique({ where: { email: body.email } });
  if (!user) throw new ApiError("Invalid email", 400);

  if (!user.active)
    throw new ApiError(
      "Your account has been restricted by the administrator."
    );

  const data = await authentication.verifyOTP(body.email, body.otp);
  return data;
}

export async function resetPassword({ body }: ResetPassword) {
  const user = await prisma.admin.findUnique({ where: { email: body.email } });
  if (!user) throw new ApiError("Invalid email", 400);

  if (!user.active)
    throw new ApiError(
      "Your account has been restricted by the administrator."
    );

  const data = await authentication.resetPassword(
    body.email,
    body.otp,
    body.password
  );
  return data;
}

export async function fetchAllInsitutionAdmins() {
  const institution_admins = await prisma.admin.findMany({
    where: {
      role: "INSTITUTION_ADMIN",
      AND: { NOT: { institution_id: null } },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      institution_id: true,
      institute: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return institution_admins;
}

export async function setAdminStatus(
  id: string,
  active: boolean
): Promise<{
  admin: Omit<Admin, "password" | "otp">;
  message: string;
}> {
  const adminExist = await prisma.admin.findUnique({ where: { id } });
  if (!adminExist) throw new ApiError("Admin not found", 404);

  const admin = await prisma.admin.update({ where: { id }, data: { active } });

  return {
    admin: excludeFields(admin, ["password", "otp"]),
    message: active
      ? "Successfully activated admin!"
      : "Successfully deactivated admin!",
  };
}

export async function editAdmin(
  id: string,
  data: Request["body"]
): Promise<
  Omit<
    {
      institute: Institutions | null;
    } & Admin,
    "password" | "otp"
  >
> {
  const adminExist = await prisma.admin.findUnique({ where: { id } });
  if (!adminExist) throw new ApiError("Admin not found", 404);

  let institution;
  if (data.institution_id) {
    institution = await prisma.institutions.findUnique({
      where: { id: data.institution_id },
      select: { id: true },
    });
    if (!institution) throw new ApiError("Institution not found", 404);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: {
      name: data.name ? data.name : adminExist.name,
      email: data.email ? data.email : adminExist.email,
      institution_id:
        adminExist.role === "SUPER_ADMIN"
          ? null
          : institution
          ? institution.id
          : adminExist.institution_id,
    },
    include: { institute: true },
  });

  return excludeFields(admin, ["password", "otp"]);
}
