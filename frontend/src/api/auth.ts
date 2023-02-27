import api from "./index";

export async function getUser(): Promise<User> {
    return api.get("auth/me").json();
}

export async function finishOAuthLogin(
    provider: string,
    params: Record<string, string | null>
): Promise<{ token: string }> {
    return api.post(`auth/${provider}/callback`, { json: { params } }).json();
}

export async function getProviders(): Promise<Provider[]> {
    return api.get("auth/providers").json();
}

type User = {
    id: string;
    email: string;
    provider: string;
    providerId: string;
    userInfo: { [key: string]: any };
};

type Provider = {
    slug: string;
    name: string;
    type: "oauth2" | "oidc";
};
