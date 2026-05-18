import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { errorResponse } from "../utils/helpers";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.status(422).json(errorResponse("Validation failed", errors));
        return;
      }
      next(err);
    }
  };