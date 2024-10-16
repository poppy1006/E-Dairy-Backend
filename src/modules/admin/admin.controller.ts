import { Request, Response } from "express";
import authorize from "../../middleware/authorize";
import {
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from "@faatlab/express-decorator";
import * as AdminService from "./admin.service";
import { validate } from "../../middleware/validate";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  verifyOTPSchema,
} from "../../validations/schema/auth";
import ApiError from "../../helper/classes/api-error";
import { checkInstitutionAdminAccess } from "../institutions/institutions.controller";

@Controller("/admin")
export default class AdminController {
  constructor(private readonly adminService = AdminService) {}

  @Post("/signin")
  @Middleware(validate(signInSchema))
  async signIn(req: Request, res: Response) {
    const data = await this.adminService.signIn(req.formatted_req);

    res.formatter.ok({ token: data.token, role: data.user.role });
  }

  @Post("/")
  @Middleware(authorize("SUPER_ADMIN"))
  async createInstitutionAdmin(req: Request, res: Response) {
    if (!req.super_admin) throw new ApiError("Unauthorized", 401);
    const data = await this.adminService.createInstitutionAdmin(req.body);

    res.formatter.ok(data);
  }

  @Get("/auth/me")
  @Middleware(authorize("SUPER_ADMIN", "INSTITUTION_ADMIN"))
  async getAdminInfo(req: Request, res: Response) {
    const data = await this.adminService.getAdminInfo(
      req.super_admin ? req.super_admin : req.institution_admin
    );

    res.formatter.ok(data);
  }

  @Post("/auth/password/forgot")
  @Middleware(validate(forgotPasswordSchema))
  async forgotPassword(req: Request, res: Response) {
    const data = await this.adminService.forgotPassword(req.formatted_req);

    res.formatter.ok(data);
  }

  @Post("/auth/verify-otp")
  @Middleware(validate(verifyOTPSchema))
  async verifyOtp(req: Request, res: Response) {
    const data = await this.adminService.verifyOtp(req.formatted_req);

    res.formatter.ok(data);
  }

  @Post("/auth/password/reset")
  @Middleware(validate(resetPasswordSchema))
  async resetPassword(req: Request, res: Response) {
    const data = await this.adminService.resetPassword(req.formatted_req);

    res.formatter.ok(data);
  }

  @Get("/")
  @Middleware(authorize("SUPER_ADMIN"))
  async fetchAllInsitutionAdmins(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.adminService.fetchAllInsitutionAdmins();

    res.formatter.ok(data);
  }

  @Put("/:id/set-status")
  @Middleware(authorize("SUPER_ADMIN"))
  async setAdminStatus(req: Request, res: Response) {
    if (!req.params.id || !req.query.active) {
      throw new ApiError("Invalid input", 400);
    }

    const data = await this.adminService.setAdminStatus(
      req.params.id,
      req.query.active == "true"
    );

    res.formatter.ok(data);
  }

  @Put("/:id")
  @Middleware(authorize("SUPER_ADMIN"))
  async editAdmin(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.adminService.editAdmin(req.params.id, req.body);

    res.formatter.ok(data);
  }
}
