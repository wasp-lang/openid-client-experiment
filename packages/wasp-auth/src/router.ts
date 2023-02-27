import { Request, Response, Router } from "express";
import type { Client } from "openid-client";

import { Provider } from "./index.js";
import {
    createCodeVerifier,
    createCodeChallenge,
    createClient,
    setVerifierCookie,
    getVerifierFromCookie
} from "./openid-client.js";

export function createOAuthRouter<User>({
    providers,
    getUser,
    makeOnSuccessResponse
}: {
    providers: Map<string, () => Provider>;
    getUser: (
        providerSlug: string,
        userInfo: { [key: string]: any }
    ) => Promise<User>;
    makeOnSuccessResponse: (user: User) => { [key: string]: any };
}): Router {
    const router = Router();

    router.get("/:provider/login", async (req: Request, res: Response) => {
        const providerSlug = req.params.provider;
        const getProvider = providers.get(providerSlug);
        if (!getProvider) {
            res.status(404).json({ error: "Provider not found" });
            return;
        }

        const provider = getProvider();
        const codeVerifier = createCodeVerifier();
        const codeChallenge = createCodeChallenge(codeVerifier);

        try {
            const client = await createClient(providerSlug, provider);
            const authUrl = client.authorizationUrl({
                scope: "openid email profile",
                access_type: "offline",
                code_challenge: codeChallenge,
                code_challenge_method: "S256",
                state: codeChallenge,
                nonce: codeChallenge
            });

            setVerifierCookie(res, providerSlug, codeVerifier);

            res.redirect(authUrl);
        } catch (e: any) {
            console.warn(e);
            res.status(400).json({
                error: `Unable to auth with ${provider.name}`
            });
        }
    });

    router.post("/:provider/callback", async (req: Request, res: Response) => {
        const providerSlug = req.params.provider;
        const getProvider = providers.get(providerSlug);
        if (!getProvider) {
            res.status(404).json({ error: "Provider not found" });
            return;
        }

        const {
            params: { code, state }
        } = req.body;

        try {
            const verifier = getVerifierFromCookie(req, res, providerSlug);
            const provider = getProvider();
            const client = await createClient(providerSlug, provider);
            const codeChallenge = createCodeChallenge(verifier);

            const userInfo = await getUserInfo(provider, client, {
                code,
                state,
                codeChallenge,
                verifier
            });
            const user = await getUser(providerSlug, userInfo);
            const response = makeOnSuccessResponse(user);
            res.json(response);
        } catch (e: any) {
            console.warn(e);
            res.status(400).json({ error: e.message });
        }
    });

    return router;
}

async function getUserInfo(
    provider: Provider,
    client: Client,
    {
        code,
        state,
        codeChallenge,
        verifier
    }: {
        code: string;
        state: string;
        codeChallenge: string;
        verifier: string;
    }
): Promise<any> {
    if (provider.type === "oidc") {
        const tokenSet = await client.callback(
            provider.redirectUrl,
            { code, state },
            {
                code_verifier: verifier,
                state: codeChallenge,
                nonce: codeChallenge
            }
        );
        let userInfo = tokenSet.claims();
        if (client.issuer.metadata.userinfo_endpoint) {
            const extraUserInfo = await client.userinfo(tokenSet.access_token!);
            userInfo = {
                ...userInfo,
                ...extraUserInfo
            };
        }
        return userInfo;
    } else {
        const tokenSet = await client.oauthCallback(
            provider.redirectUrl,
            {
                code,
                state
            },
            {
                code_verifier: verifier,
                state: codeChallenge
            }
        );
        return client.userinfo(tokenSet.access_token!);
    }
}
