/* eslint-disable @typescript-eslint/no-empty-function */
import { Request, Response } from "express";
import authorize from "../../middleware/authorize";
import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
} from "@faatlab/express-decorator";
import * as FeedbackService from "./feedback.service";
import { checkInstitutionAdminAccess } from "../institutions/institutions.controller";

@Controller("/feedbacks")
export default class FeedbackController {
  constructor(private readonly feedbackService = FeedbackService) {}

  @Post("/")
  @Middleware(authorize("STUDENT"))
  async createFeedback(req: Request, res: Response) {
    const data = await this.feedbackService.createStudentFeedback(
      req.student,
      req.body.feedback
    );
    res.formatter.ok(data);
  }

  // get all feedbacks
  @Get("/")
  @Middleware(authorize("SUPER_ADMIN"))
  async fetchAllFeedbacks(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.feedbackService.fetchAllFeedbacks();
    res.formatter.ok(data);
  }

  // fetch single feedback
  @Get("/:id")
  @Middleware(authorize("SUPER_ADMIN"))
  async fetchSingleFeedback(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.feedbackService.fetchSingleFeedback(req.params.id);
    res.formatter.ok(data);
  }

  // delete a feedback
  @Delete("/:id")
  @Middleware(authorize("SUPER_ADMIN"))
  async deleteSingleFeedback(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.feedbackService.deleteSingleFeedback(req.params.id);
    res.formatter.ok(data);
  }
}
