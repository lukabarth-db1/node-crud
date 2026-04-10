import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from "zod";

const validate = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: z.flattenError(result.error).fieldErrors,
      });
      return;
    }
    
    req.body = result.data;
    next();
  };
};

export default validate;
