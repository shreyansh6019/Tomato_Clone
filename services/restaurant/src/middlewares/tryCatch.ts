import { RequestHandler, Request, Response, NextFunction } from "express";

const trycatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default trycatch;