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
import * as PosService from "./pos.service";
import { unAuthorizedException } from "../../middleware/authorize/helper";

@Controller("/pos")
export default class StudentController {
  constructor(private readonly posService = PosService) {}

  @Post("/")
  @Middleware(authorize("INSTITUTION_ADMIN"))
  async createPOS(req: Request, res: Response) {
    const data = await this.posService.createPOS(
      req.body,
      <string>req.institution_admin.institution_id
    );

    res.formatter.ok(data);
  }

  @Get("/:id")
  @Middleware(authorize("INSTITUTION_ADMIN"))
  async fetchSinglePOSDetails(req: Request, res: Response) {
    const data = await this.posService.fetchSinglePOSDetails(req.params.id);

    res.formatter.ok(data);
  }

  @Put("/:id")
  @Middleware(authorize("INSTITUTION_ADMIN"))
  async editPOS(req: Request, res: Response) {
    const data = await this.posService.editPOS(req.params.id, req.body);

    res.formatter.ok(data);
  }

  @Get("/")
  @Middleware(authorize("SUPER_ADMIN"))
  async fetchAllPOS(req: Request, res: Response) {
    if (req.institution_admin) unAuthorizedException();
    const data = await this.posService.fetchAllPOS();
    res.formatter.ok(data);
  }
}
