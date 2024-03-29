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
            const params: {
                scope: string;
                access_type: string;
                code_challenge?: string;
                code_challenge_method?: string;
                state: string;
                nonce: string;
            } = {
                scope: provider.scope ?? "openid email profile",
                access_type: "offline",
                state: codeChallenge,
                nonce: codeChallenge
            };
            if (!provider.disablePKCE) {
                params.code_challenge = codeChallenge;
                params.code_challenge_method = "S256";
            }
            const authUrl = client.authorizationUrl(params);

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
            res.status(400).json({ error: "Provider not found" });
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

    router.get("/providers", (req: Request, res: Response) => {
        const providerList = Array.from(providers.keys()).map((slug) => {
            const provider = providers.get(slug)!();
            return {
                slug,
                name: provider.name,
                type: provider.type
            };
        });
        res.json(providerList);
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
        let userInfo = {
            ...tokenSet,
            ...tokenSet.claims()
        };
        // Redundant field since we parsed it in claims()
        delete userInfo.id_token;

        if (client.issuer.metadata.userinfo_endpoint) {
            const extraUserInfo = await client.userinfo(tokenSet.access_token!);
            userInfo = {
                ...userInfo,
                ...extraUserInfo
            };
        }
        return userInfo;
    } else {
        const checks: { state: string; code_verifier?: string } = {
            state: codeChallenge
        };

        // We include PKCE checks by default, but some providers fail if included
        if (!provider.disablePKCE) {
            checks.code_verifier = verifier;
        }
        const tokenSet = await client.oauthCallback(
            provider.redirectUrl,
            {
                code,
                state
            },
            checks
        );
        let userInfo = {
            ...tokenSet
        };
        // Try to get extra user info, but it might fail
        // e.g. Notion has a required header which we can't send with the userinfo request due to openid-client
        // https://developers.notion.com/reference/get-self
        try {
            const extraUserInfo = await client.userinfo(tokenSet.access_token!);
            userInfo = {
                ...userInfo,
                ...extraUserInfo
            };
        } catch (e: any) {
            console.warn(e);
        }
        return userInfo;
    }
}
