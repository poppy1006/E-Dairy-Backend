import { Request, Response } from "express";
import authorize from "../../middleware/authorize";
import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from "@faatlab/express-decorator";
import * as InstitutionsService from "./institutions.service";
import { unAuthorizedException } from "../../middleware/authorize/helper";

export const checkInstitutionAdminAccess = (req: Request) => {
  if (
    req.institution_admin &&
    req.institution_admin.institution_id != req.params.id
  )
    unAuthorizedException();
};

@Controller("/institutions")
export default class AdminController {
  constructor(private readonly institutionsService = InstitutionsService) {}

  @Post("/")
  @Middleware(authorize("SUPER_ADMIN"))
  async createInstitution(req: Request, res: Response) {
    const data = await this.institutionsService.createInstitution(req.body);

    res.formatter.ok(data);
  }

  @Get("/:id")
  @Middleware(authorize("INSTITUTION_ADMIN", "SUPER_ADMIN"))
  async fetchSingleInstitution(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.institutionsService.fetchSingleInstitution(
      req.params.id
    );

    res.formatter.ok(data);
  }

  @Get("/")
  @Middleware(authorize("SUPER_ADMIN"))
  async fetchAllInstitutions(req: Request, res: Response) {
    const data = await this.institutionsService.fetchAllInstitution();

    res.formatter.ok(data);
  }

  @Delete("/:id")
  @Middleware(authorize("SUPER_ADMIN"))
  async deleteInstitution(req: Request, res: Response) {
    const data = await this.institutionsService.deleteInstitution(
      req.params.id
    );

    res.formatter.ok(data);
  }

  @Put("/:id")
  @Middleware(authorize("SUPER_ADMIN"))
  async updateInstitutionDetails(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.institutionsService.updateInstitutionDetails(
      req.params.id,
      req.body
    );

    res.formatter.ok(data);
  }

  @Get("/:id/students")
  @Middleware(authorize("SUPER_ADMIN", "INSTITUTION_ADMIN"))
  async viewStudents(req: Request, res: Response) {
    checkInstitutionAdminAccess(req);
    const data = await this.institutionsService.viewStudents(req.params.id);

    res.formatter.ok(data);
  }

  // fetch all departments in an institiution
  @Get("/:id/departments")
  @Middleware(authorize("INSTITUTION_ADMIN", "SUPER_ADMIN"))
  async fetchAllDepartmentsFromAnInstitution(req: Request, res: Response) {
    const data =
      await this.institutionsService.fetchAllDepartmentFromAnInstitution(
        req.params.id
      );
    res.formatter.ok(data);
  }

  // create a department for a specific institution
  @Post("/:id/departments")
  @Middleware(authorize("SUPER_ADMIN"))
  async createDepartment(req: Request, res: Response) {
    const data = await this.institutionsService.createDepartment(
      req.body,
      req.params.id
    );
    res.formatter.ok(data);
  }

  // fetch single department from  that institution
  @Get("/:id/departments/:department_id")
  @Middleware(authorize("SUPER_ADMIN"))
  async fetchSingleDepartment(req: Request, res: Response) {
    const data = await this.institutionsService.fetchSingleDepartment(
      req.params.department_id
    );
    res.formatter.ok(data);
  }

  // delete single department from that instition
  @Delete("/:id/departments/:department_id")
  @Middleware(authorize("SUPER_ADMIN"))
  async deleteSingleDepartment(req: Request, res: Response) {
    const data = await this.institutionsService.deleteSingleDepartment(
      req.params.department_id
    );
    res.formatter.ok(data);
  }
}
