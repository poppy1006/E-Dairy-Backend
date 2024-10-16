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
import * as CardService from "./card.service";

@Controller("/card")
export default class StudentController {
  constructor(private readonly cardService = CardService) {}

  @Put("/status/deactivate")
  @Middleware(authorize("STUDENT"))
  async deactivateCard(req: Request, res: Response) {
    const data = await this.cardService.setCardStatus(req.student.id, false);
    res.formatter.ok(data);
  }

  @Put("/status/reactivate")
  @Middleware(authorize("STUDENT"))
  async reactivateCard(req: Request, res: Response) {
    const data = await this.cardService.setCardStatus(req.student.id, true);
    res.formatter.ok(data);
  }

  @Get("/")
  @Middleware(authorize("STUDENT"))
  async viewCard(req: Request, res: Response) {
    const data = await this.cardService.fetchCardDetails(req.student.id);
    res.formatter.ok(data);
  }

  @Post("/set-limit")
  @Middleware(authorize("STUDENT"))
  async setLimit(req: Request, res: Response) {
    const data = await this.cardService.setCardLimit(
      req.student.id,
      req.body.limit
    );
    res.formatter.ok(data);
  }
}
