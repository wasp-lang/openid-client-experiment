import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { finishOAuthLogin } from "./api/auth";
import { setToken } from "./auth";

function AuthCallback() {
    const { provider } = useParams();
    const { search } = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState<Error | null>(null);

    const query = new URLSearchParams(search);
    const code = query.get("code");
    const state = query.get("state");

    useEffect(() => {
        if (provider && code && state) {
            exchangeCodeForToken(provider, code, state)
                .then(() => navigate("/"))
                .catch((error) => setError(new Error(error.message)));
        }
    }, [provider, code, state]);

    return (
        <div>
            {error ? (
                <div>
                    <h1>Something went wrong</h1>
                    <p>{error.message}</p>
                </div>
            ) : (
                <div>
                    <h1>Logging you in...</h1>
                </div>
            )}
        </div>
    );
}

async function exchangeCodeForToken(
    provider: string,
    code: string,
    state: string | null
) {
    const response = await finishOAuthLogin(provider, { code, state });
    setToken(response.token);
}

export default AuthCallback;
