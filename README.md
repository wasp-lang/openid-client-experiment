# openid-client experimental implementation

The idea was to use `openid-client` package to cover as many auth providers as possible.

There are three pieces of code:
- `@wasp-lang/auth` package that provides `createOAuthRouter` function that can be used to create a router that can be used to handle OAuth flow
- `api` that uses `createOAuthRouter` and provides a simple API that can be used to login and get the current user
- `frontend` that uses `api` to login and gets the current user

### Running it locally

Make sure to build and link `@wasp-lang/auth` package:
```bash
cd packages/wasp-auth
npm run build
npm link
```

Install the local package in `api` with:
```bash
cd api
npm link @wasp-lang/auth
```

Run the `api` with:
```bash
npm run dev
```

Run the `frontend` with:
```bash
cd frontend
npm run dev
```
