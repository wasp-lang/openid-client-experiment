export type Provider = ProviderOIDC | ProviderOAuth2;

export type ProviderOIDC = {
    type: "oidc";
    issuer: string;
    redirectUrl: string;
} & ProviderCommon;

export type ProviderOAuth2 = {
    type: "oauth2";
    authorizeUrl: string;
    accessUrl: string;
    profileUrl: string;
    redirectUrl: string;
    aditionalIssuerMetadata?: Record<string, any>;
} & ProviderCommon;

type ProviderCommon = {
    name: string;
    clientId?: string;
    clientSecret?: string;
    redirectUrl: string;
    scope?: string;
    additionalClientParams?: Record<string, any>;
};
