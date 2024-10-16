/* eslint-disable @typescript-eslint/no-empty-function */
import { Request, Response } from "express";
import authorize from "../../middleware/authorize";
import {
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from "@faatlab/express-decorator";
import * as StudentService from "./student.service";
import { validate } from "../../middleware/validate";
import { changePasswordSchema } from "../../validations/schema/common";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  verifyOTPSchema,
} from "../../validations/schema/auth";
import upload from "../../middleware/multer";

const upload_file = upload.single("display_picture");

@Controller("/students")
export default class StudentController {
  constructor(private readonly studentService = StudentService) {}

  @Post("/onboard")
  @Middleware(authorize("SUPER_ADMIN"), upload_file)
  async onBoardStudent(req: Request, res: Response) {
    res.formatter.ok(
      await this.studentService.onBoardStudent(req.body, req.file)
    );
  }

  @Get("/profile")
  @Middleware(authorize("STUDENT"))
  async getStudentInfo(req: Request, res: Response) {
    res.formatter.ok(await this.studentService.getStudentInfo(req.student.id));
  }

  @Post("/signin")
  @Middleware(validate(signInSchema))
  async signIn(req: Request, res: Response) {
    const data = await this.studentService.signIn(req.formatted_req);

    res.formatter.ok(data);
  }

  @Post("/auth/password/forgot")
  @Middleware(validate(forgotPasswordSchema))
  async forgotPassword(req: Request, res: Response) {
    const data = await this.studentService.forgotPassword(req.formatted_req);

    res.formatter.ok(data);
  }

  @Post("/auth/verify-otp")
  @Middleware(validate(verifyOTPSchema))
  async verifyOtp(req: Request, res: Response) {
    const data = await this.studentService.verifyOtp(req.formatted_req);

    res.formatter.ok(data);
  }

  @Post("/auth/password/reset")
  @Middleware(validate(resetPasswordSchema))
  async resetPassword(req: Request, res: Response) {
    const data = await this.studentService.resetPassword(req.formatted_req);

    res.formatter.ok(data);
  }

  @Post("/auth/password/change")
  @Middleware(authorize("STUDENT"), validate(changePasswordSchema))
  async changePassword(req: Request, res: Response) {
    const data = await this.studentService.changePassword(
      req.formatted_req,
      req.student.id
    );
    res.formatter.ok(data);
  }

  @Put("/:id/set-status")
  @Middleware(authorize("SUPER_ADMIN"))
  async setStudentStatus(req: Request, res: Response) {
    const data = await this.studentService.setStudentStatus(
      req.params.id,
      req.query.active === "true"
    );
    res.formatter.ok(data);
  }

  @Put("/:id")
  @Middleware(authorize("SUPER_ADMIN"))
  async editStudentProfile(req: Request, res: Response) {
    const data = await this.studentService.editStudentProfile(
      req.params.id,
      req.body
    );
    res.formatter.ok(data);
  }
}
