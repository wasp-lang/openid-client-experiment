import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

import { User } from "./db.js";

export function makeToken(user: User): string {
  return jwt.sign({ id: user.id }, env.SECRET, {
    expiresIn: "1d",
    issuer: "auth.server.2.0",
  });
}

export function useJwt() {
  return [
    expressjwt({
      secret: env.SECRET,
      issuer: "auth.server.2.0",
      algorithms: ["HS256"],
    }),
    function (err: any, req: Request, res: Response, next: NextFunction) {
      res.status(err.status).json(err);
    },
  ];
}
