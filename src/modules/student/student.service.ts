import * as bcrypt from "bcrypt";
import ApiError from "../../helper/classes/api-error";
import { prisma } from "../../prisma";
import excludeFields from "../../helper/functions/execludeFields";
import Authentication from "../../helper/classes/authentication";
import { ChangePassword } from "../../validations/schema/common";
import {
  ResetPassword,
  ForgotPassword,
  SignIn,
  VerifyOTP,
} from "../../validations/schema/auth";
import emails from "../../helper/functions/mailer";
import hashPassword from "../../helper/functions/hashPassword";
import { Student } from "@prisma/client";
import generatePassword from "../../helper/functions/generatePassword";
import { Request } from "express";
import path from "path";
import fs from "fs";
interface OnBoardStudent {
  name: string;
  email: string;
  phone_no: string;
  institution_id: string;
  registration_no: string;
  password: string;
  expiry_date: Date;
  dob: Date;
  department_id: string;
  blood_group: string;
  address: string;
  admission_year: string;
}

const authentication = new Authentication(prisma.student);

export async function changePassword({ body }: ChangePassword, id: string) {
  const { old_password, confirm_password } = body;
  const studentExist = await prisma.student.findUnique({ where: { id } });

  if (!studentExist) throw new ApiError("User not found");

  const isValid = await bcrypt.compare(
    old_password,
    <string>studentExist.password
  );
  if (!isValid) throw new ApiError("Invalid password");

  if (!(old_password === confirm_password))
    throw new ApiError("Passwords do not match");

  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(body.password, salt);
  body.password = hashed_password;

  const endUser = await prisma.student.update({
    where: { id },
    data: { password: body.password },
  });

  return excludeFields(endUser, ["password", "otp"]);
}

export async function signIn({ body }: SignIn) {
  const student = await prisma.student.findUnique({
    where: { email: body.email },
  });
  if (!student) throw new ApiError("Invalid email or password");
  if (!student.active)
    throw new ApiError(
      "Your account has been restricted by the Administrator."
    );

  const data = <
    {
      token: string;
      user: Student;
    }
  >await authentication.signIn(body.email, body.password);

  const { user } = data;
  return { verified: true, ...data, message: "logged in successfully" };
}

export async function forgotPassword({ body }: ForgotPassword) {
  if (!body.email) throw new ApiError("email is required");
  await authentication.forgotPassword(body.email);
  return { message: "OTP sent to mail" };
}

export async function verifyOtp({ body }: VerifyOTP) {
  const data = await authentication.verifyOTP(body.email, body.otp);
  return data;
}

export async function resetPassword({ body }: ResetPassword) {
  const { email, otp, password } = body;
  const data = await authentication.resetPassword(email, otp, password);
  return data;
}

export async function getStudentInfo(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      institution: true,
    },
  });

  if (!student) throw new ApiError("User not found", 404);

  return excludeFields(student, ["password", "otp"]);
}

export async function onBoardStudent(
  body: OnBoardStudent,
  img: Request["file"]
) {
  if (!img)
    throw new ApiError("Provide a display picture for the student", 400);

  const imagesDir = path.join(__dirname, "../../../public/images");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const image_url = path.join("public/images", img.originalname);
  fs.renameSync(img.path, image_url);

  // create student and link institution_id
  const password = generatePassword();
  const student_data = {
    name: body.name,
    email: body.email,
    password: await hashPassword(password),
    registration_no: body.registration_no,
    institution_id: body.institution_id,
    phone_no: body.phone_no,
    dob: new Date(body.dob),
    blood_group: body.blood_group,
    department_id: body.department_id,
    address: JSON.parse(body.address),
    display_picture: image_url,
    admission_year: body.admission_year,
  };

  // Start db transaction
  const result = await prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: student_data,
      include: { institution: true, department: true },
    });

    // create wallet and link std_id
    const wallet = await tx.wallet.create({
      data: {
        student_id: student.id,
        balance: 0,
      },
    });

    // create idcard and link std_id
    const idcard = await tx.iDcard.create({
      data: {
        student_id: student.id,
        expiry_date: new Date(body.expiry_date),
        active: true,
      },
    });

    // send login credentials to student's email
    await emails.loginCredentials(student.email, student.name, password);

    return {
      student: excludeFields(student, ["password", "otp"]),
      wallet,
      idcard,
    };
  });

  return result;
}

export async function setStudentStatus(
  id: string,
  status: boolean
): Promise<{
  student: Omit<Student, "password" | "otp">;
  message: string;
}> {
  const studentExist = await prisma.student.findUnique({ where: { id } });
  if (!studentExist) throw new ApiError("Student not found", 404);

  const student = await prisma.student.update({
    where: { id },
    data: { active: status },
  });

  return {
    student: excludeFields(student, ["password", "otp"]),
    message: status
      ? `Successfully activated student`
      : "Successfull deactivated student",
  };
}

export async function editStudentProfile(id: string, data: OnBoardStudent) {
  const studentExist = await prisma.student.findUnique({ where: { id } });
  if (!studentExist) throw new ApiError("Student not found", 404);

  const updateDate: {
    name?: string;
    email?: string;
    phone_no?: string;
    institution_id?: string;
    registration_no?: string;
    dob?: Date;
    department_id?: string;
    blood_group?: string;
    address?: string;
    admission_year?: string;
    active?: boolean;
  } = {};

  data.name && (updateDate["name"] = data.name);
  data.email && (updateDate["email"] = data.email);
  data.phone_no && (updateDate["phone_no"] = data.phone_no);
  data.institution_id && (updateDate["institution_id"] = data.institution_id);
  data.registration_no &&
    (updateDate["registration_no"] = data.registration_no);
  data.dob && (updateDate["dob"] = new Date(data.dob));
  data.department_id && (updateDate["department_id"] = data.department_id);
  data.blood_group && (updateDate["blood_group"] = data.blood_group);
  data.address && (updateDate["address"] = data.address);
  data.admission_year && (updateDate["admission_year"] = data.admission_year);

  const student = await prisma.student.update({
    where: { id },
    data: updateDate,
  });

  return excludeFields(student, ["password", "otp"]);
}
