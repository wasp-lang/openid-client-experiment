import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
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
            // Convert URLSearchParams to object
            const params = Object.fromEntries(query.entries());
            exchangeCodeForToken(provider, params)
                .then(() => navigate("/"))
                .catch((error) => setError(new Error(error.message)));
        }
    }, [provider, code, state]);

    return (
        <div>
            {error ? (
                <div>
                    <h1>Something went wrong</h1>
                    <p style={{ marginBottom: "2rem" }}>{error.message}</p>
                    <Link to="/" className="button">
                        Go Back
                    </Link>
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
    params: { [key: string]: string }
) {
    const response = await finishOAuthLogin(provider, params);
    setToken(response.token);
}

export default AuthCallback;
