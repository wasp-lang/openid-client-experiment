import dotenv from "dotenv";

dotenv.config();

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Request as JWTRequest } from "express-jwt";

import { createOAuthRouter } from "@wasp-lang/auth";

import { users } from "./db.js";
import { makeToken, useJwt } from "./auth.js";
import { getProviders } from "./providers.js";

const app: Express = express();

app.use(
    cors({
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        origin: ["http://localhost:3000"]
    })
);
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    if (err.name === "UnauthorizedError") {
        res.status(err.status).send({ message: err.message });
        return;
    }
    next();
});

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
    res.send("Auth server 2.0");
});

app.get("/auth/me", ...useJwt(), (req: JWTRequest, res: Response) => {
    const user = users.findBy("id", req.auth?.id);
    if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
    }
    res.json(user);
});

app.use(
    "/auth",
    createOAuthRouter({
        providers: getProviders(),
        getUser: async (providerSlug, userInfo) => {
            if (!users.findBy("provider", providerSlug)) {
                users.create({
                    email: userInfo.email!,
                    provider: providerSlug,
                    providerId: userInfo.sub,
                    userInfo
                });
            }
            const user = users.findBy("provider", providerSlug)!;
            return user;
        },
        makeOnSuccessResponse: (user) => {
            const token = makeToken(user);
            return { token };
        }
    })
);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
