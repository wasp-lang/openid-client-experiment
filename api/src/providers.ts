import { ProviderOIDC, ProviderOAuth2, Provider } from "@wasp-lang/auth";

export function getProviders() {
    const providers: Map<string, () => Provider> = new Map();

    const clientUrl = "http://localhost:3000";

    registerProvider("google", {
        type: "oidc",
        name: "Google",
        issuer: "https://accounts.google.com",
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET
    });
    registerProvider("github", {
        type: "oauth2",
        name: "GitHub",
        authorizeUrl: "https://github.com/login/oauth/authorize",
        accessUrl: "https://github.com/login/oauth/access_token",
        profileUrl: "https://api.github.com/user",
        clientId: process.env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET
    });
    // Waiting for access
    registerProvider("twitter", {
        type: "oauth2",
        name: "Twitter",
        authorizeUrl: "https://twitter.com/i/oauth2/authorize",
        accessUrl: "https://api.twitter.com/2/oauth2/token",
        profileUrl: "https://api.twitter.com/2/users/me",
        clientId: process.env.AUTH_TWITTER_CLIENT_ID,
        clientSecret: process.env.AUTH_TWITTER_CLIENT_SECRET
    });
    // Requires business verfiication
    registerProvider("facebook", {
        type: "oauth2",
        name: "Facebook",
        authorizeUrl: "https://www.facebook.com/dialog/oauth",
        accessUrl: "https://graph.facebook.com/oauth/access_token",
        profileUrl: "https://graph.facebook.com/me?fields=email",
        clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET
    });
    registerProvider("microsoft", {
        type: "oidc",
        name: "Microsoft",
        // Here's the first example of a provider that doesn't have a static issuer URL
        issuer: "https://login.microsoftonline.com/ad9421ca-887c-4c15-9e8a-87fe9dc4f96b/v2.0/.well-known/openid-configuration",
        clientId: process.env.AUTH_MICROSOFT_CLIENT_ID,
        clientSecret: process.env.AUTH_MICROSOFT_CLIENT_SECRET
    });

    return providers;

    function registerProvider(
        slug: string,
        provider:
            | Omit<ProviderOIDC, "redirectUrl">
            | Omit<ProviderOAuth2, "redirectUrl">
    ): void {
        providers.set(slug, () => ({
            ...provider,
            redirectUrl: makeRedirectURL(slug)
        }));
    }

    function makeRedirectURL(providerSlug: string): string {
        return `${clientUrl}/auth/${providerSlug}/callback`;
    }
}
