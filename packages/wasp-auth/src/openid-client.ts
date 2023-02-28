import type { Request, Response } from "express";
import { Client, generators, Issuer } from "openid-client";
import jwt from "jsonwebtoken";

import { Provider } from "./index.js";

export async function createClient(
    providerSlug: string,
    provider: Provider
): Promise<Client> {
    if (!provider.clientId || !provider.clientSecret) {
        return Promise.reject(
            new Error(
                `Missing client ID or secret for provider ${providerSlug}`
            )
        );
    }
    let issuer: Issuer<Client>;
    if (provider.type === "oauth2") {
        issuer = new Issuer({
            issuer: providerSlug,
            authorization_endpoint: provider.authorizeUrl,
            token_endpoint: provider.accessUrl,
            userinfo_endpoint: provider.profileUrl,
            ...(provider.aditionalIssuerMetadata ?? {})
        });
    } else {
        if (!provider.issuer) {
            return Promise.reject(
                new Error(`Missing issuer for provider ${providerSlug}`)
            );
        }
        issuer = await Issuer.discover(provider.issuer);
    }

    return new issuer.Client({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        redirect_uris: [provider.redirectUrl],
        response_types: ["code"],
        ...(provider.additionalClientParams ?? {})
    });
}

export function createCodeVerifier(): string {
    return generators.codeVerifier();
}

export function createCodeChallenge(codeVerifier: string): string {
    return generators.codeChallenge(codeVerifier);
}

export function setVerifierCookie(
    res: Response,
    providerSlug: string,
    verifier: string
): void {
    const token = jwt.sign({ verifier }, process.env.SECRET as string, {
        expiresIn: "5m",
        issuer: "auth.server.2.0"
    });

    const cookieName = getVerifierCookieName(providerSlug);
    res.cookie(cookieName, token, {
        httpOnly: true,
        sameSite: "lax"
    });
}

export function getVerifierFromCookie(
    req: Request,
    res: Response,
    providerSlug: string
): string {
    const cookieName = getVerifierCookieName(providerSlug);
    const cookie = req.cookies[cookieName];

    if (!cookie) {
        throw new Error("Missing verifier cookie");
    }

    const tokenData = jwt.verify(cookie, process.env.SECRET as string, {
        issuer: "auth.server.2.0"
    }) as {
        verifier: string;
    };
    const { verifier } = tokenData;

    res.clearCookie(cookieName);

    return verifier;
}

function getVerifierCookieName(providerSlug: string): string {
    return `oauth2.${providerSlug}`;
}
