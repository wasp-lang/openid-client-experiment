# openid-client experimental implementation

The idea was to use `openid-client` package to cover as many auth providers as possible.

There are three pieces of code:
- `@wasp-lang/auth` package that provides `createOAuthRouter` function that can be used to create a router that can be used to handle OAuth flow
- `api` that uses `createOAuthRouter` and provides a simple API that can be used to login and get the current user
- `frontend` that uses `api` to login and gets the current user
