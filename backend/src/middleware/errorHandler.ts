import { error } from "console";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unexpected error occurred", err);

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};
