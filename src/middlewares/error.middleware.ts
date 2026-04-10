import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from 'mongoose';

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.message === 'Product not found') {
    res.status(404).json({ message: error.message });
    return;
  }

  if (error instanceof MongooseError.CastError) {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
};

export default errorMiddleware;
