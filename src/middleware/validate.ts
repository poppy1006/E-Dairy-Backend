import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { generateErrorMessage } from "zod-error";
declare module "express-serve-static-core" {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatted_req: any;
  }
}

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success)
      return res
        .status(400)
        .json({ error: generateErrorMessage(result.error.issues) });

    req["formatted_req"] = result.data;
    next();
  };
