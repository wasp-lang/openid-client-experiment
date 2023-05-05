import waspLogo from "./assets/wasp.svg";
import "./App.css";
import { deleteToken } from "./auth";
import { JsonViewer } from "@textea/json-viewer";
import { useUser, removeUser, useProviders } from "./auth/hooks";
import { env } from "./env";

function App() {
    const { user, isLoading: isUserLoading } = useUser();
    const { providers, isLoading: areProvidersLoading } = useProviders();
    const disabledProviders = ["facebook", "twitter", "apple"];

    function logout() {
        deleteToken();
        removeUser();
    }

    return (
        <div className="App">
            <div className="header">
                <a href="https://wasp-lang.dev" target="_blank">
                    <img src={waspLogo} className="logo wasp" alt="Wasp logo" />
                </a>
                {user && (
                    <button className="button" onClick={logout}>
                        Logout
                    </button>
                )}
            </div>
            <h1>Auth Server 2.0</h1>

            {!isUserLoading && (
                <div className="user">
                    {!user && <pre>Not logged in</pre>}
                    {user && (
                        <JsonViewer
                            value={user}
                            theme="dark"
                            displayDataTypes={false}
                            style={{ padding: "1rem" }}
                        />
                    )}
                </div>
            )}
            {isUserLoading && <div>Loading user...</div>}
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    maxWidth: "50vw",
                    flexWrap: "wrap"
                }}
            >
                {areProvidersLoading && <div>Loading providers...</div>}
                {providers &&
                    providers.map((provider) => (
                        <a
                            key={provider.slug}
                            className={`provider-button button${
                                disabledProviders.includes(provider.slug)
                                    ? " disabled"
                                    : ""
                            }`}
                            href={`${env.VITE_SERVER_URL}/auth/${provider.slug}/login`}
                        >
                            <span className="icon">
                                <img
                                    src={`https://simpleicons.org/icons/${provider.slug}.svg`}
                                    alt=""
                                />
                            </span>
                            Login with {provider.name}
                        </a>
                    ))}
            </div>
        </div>
    );
}

export default App;
