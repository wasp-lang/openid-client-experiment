import api from "./index";

type User = {
    id: string;
    email: string;
    provider: string;
    providerId: string;
    userInfo: { [key: string]: any };
};

export async function getUser(): Promise<User> {
    return api.get("auth/me").json();
}

export async function finishOAuthLogin(
    provider: string,
    params: Record<string, string | null>
): Promise<{ token: string }> {
    return api.post(`auth/${provider}/callback`, { json: { params } }).json();
}
