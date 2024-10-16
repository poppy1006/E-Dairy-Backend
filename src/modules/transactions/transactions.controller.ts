/* eslint-disable @typescript-eslint/no-empty-function */
import { Request, Response } from "express";
import authorize from "../../middleware/authorize";
import { Controller, Get, Middleware, Post } from "@faatlab/express-decorator";
import * as TransactionsService from "./transactions.service";

@Controller("/transactions")
export default class TransactionsController {
  constructor(private readonly transactionsService = TransactionsService) {}

  @Get("/")
  @Middleware(authorize("STUDENT", "SUPER_ADMIN"))
  async fetchAllTransactions(req: Request, res: Response) {
    const data = await this.transactionsService.getAllTransactions(
      req.student ? req.student.id : undefined,
      req.query.recent === "true",
      req.super_admin ? true : false
    );

    res.formatter.ok(data);
  }

  // TODO: include for super admin if needed
  @Get("/:id")
  @Middleware(authorize("STUDENT"))
  async fetchSingleTransactionDetails(req: Request, res: Response) {
    const data = await this.transactionsService.fetchSingleTransactionDetails(
      req.params.id
    );

    res.formatter.ok(data);
  }

  @Post("/")
  @Middleware(authorize("STUDENT"))
  async createTransaction(req: Request, res: Response) {
    const data = await this.transactionsService.createTransaction(
      req.body,
      req.student.id
    );

    res.formatter.ok(data);
  }
}
