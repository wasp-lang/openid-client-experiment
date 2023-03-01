import { ProviderOIDC, ProviderOAuth2, Provider } from "@wasp-lang/auth";

export function getProviders() {
    const providers: Map<string, () => Provider> = new Map();

    const clientUrl = process.env.CLIENT_URL;

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
        issuer: process.env.AUTH_MICROSOFT_ISSUER_URL,
        clientId: process.env.AUTH_MICROSOFT_CLIENT_ID,
        clientSecret: process.env.AUTH_MICROSOFT_CLIENT_SECRET
    });
    registerProvider("discord", {
        type: "oauth2",
        name: "Discord",
        authorizeUrl: "https://discord.com/api/oauth2/authorize",
        accessUrl: "https://discord.com/api/oauth2/token",
        profileUrl: "https://discord.com/api/users/@me",
        clientId: process.env.AUTH_DISCORD_CLIENT_ID,
        clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET,
        scope: "identify email"
    });
    registerProvider("twitch", {
        type: "oidc",
        name: "Twitch",
        issuer: "https://id.twitch.tv/oauth2/.well-known/openid-configuration",
        clientId: process.env.AUTH_TWITCH_CLIENT_ID,
        clientSecret: process.env.AUTH_TWITCH_CLIENT_SECRET,
        scope: "openid user:read:email"
    });
    registerProvider("linkedin", {
        type: "oauth2",
        name: "LinkedIn",
        authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
        accessUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        profileUrl: "https://api.linkedin.com/v2/me",
        clientId: process.env.AUTH_LINKEDIN_CLIENT_ID,
        clientSecret: process.env.AUTH_LINKEDIN_CLIENT_SECRET,
        scope: "r_liteprofile r_emailaddress",
        aditionalIssuerMetadata: {
            token_endpoint_auth_methods_supported: ["client_secret_post"]
        },
        disablePKCE: true
    });
    registerProvider("apple", {
        type: "oidc",
        name: "Apple",
        issuer: "https://appleid.apple.com/.well-known/openid-configuration",
        clientId: process.env.AUTH_APPLE_CLIENT_ID,
        clientSecret: process.env.AUTH_APPLE_CLIENT_SECRET,
        scope: "name email",
        additionalClientParams: { response_mode: "form_post" }
    });
    registerProvider("spotify", {
        type: "oauth2",
        name: "Spotify",
        authorizeUrl: "https://accounts.spotify.com/authorize",
        accessUrl: "https://accounts.spotify.com/api/token",
        profileUrl: "https://api.spotify.com/v1/me",
        clientId: process.env.AUTH_SPOTIFY_CLIENT_ID,
        clientSecret: process.env.AUTH_SPOTIFY_CLIENT_SECRET,
        scope: "user-read-private user-read-email"
    });
    registerProvider("notion", {
        type: "oauth2",
        name: "Notion",
        authorizeUrl: "https://api.notion.com/v1/oauth/authorize",
        accessUrl: "https://api.notion.com/v1/oauth/token",
        profileUrl: "https://api.notion.com/v1/users/me",
        clientId: process.env.AUTH_NOTION_CLIENT_ID,
        clientSecret: process.env.AUTH_NOTION_CLIENT_SECRET,
        scope: "basic_read"
    });
    registerProvider("slack", {
        type: "oidc",
        name: "Slack",
        issuer: "https://slack.com/.well-known/openid-configuration",
        clientId: process.env.AUTH_SLACK_CLIENT_ID,
        clientSecret: process.env.AUTH_SLACK_CLIENT_SECRET,
        scope: "openid email"
    });
    registerProvider("zoom", {
        type: "oauth2",
        name: "Zoom",
        authorizeUrl: "https://zoom.us/oauth/authorize",
        accessUrl: "https://zoom.us/oauth/token",
        profileUrl: "https://api.zoom.us/v2/users/me",
        clientId: process.env.AUTH_ZOOM_CLIENT_ID,
        clientSecret: process.env.AUTH_ZOOM_CLIENT_SECRET,
        scope: "user:read"
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
