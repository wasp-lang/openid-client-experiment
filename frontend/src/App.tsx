import { useState, useEffect } from "react";
import waspLogo from "./assets/wasp.svg";
import "./App.css";
import { getUser, getProviders } from "./api/auth";
import { deleteToken } from "./auth";
import { JsonViewer } from "@textea/json-viewer";

type User = Awaited<ReturnType<typeof getUser>>;
type Providers = Awaited<ReturnType<typeof getProviders>>;

function App() {
    const [providers, setProviders] = useState<Providers>([]);
    const [user, setUser] = useState<User | null>(null);
    const disabledProviders = ["facebook", "twitter", "apple", "linkedin"];

    useEffect(() => {
        getProviders()
            .then((providers) => {
                setProviders(providers);
            })
            .catch((e) => {
                // console.log("Error while getting providers:", e);
            });
        getUser()
            .then((user) => {
                setUser(user);
            })
            .catch((e) => {
                // console.log("Error while getting user:", e);
            });
    }, []);

    function logout() {
        deleteToken();
        setUser(null);
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
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    maxWidth: "50vw",
                    flexWrap: "wrap"
                }}
            >
                {providers.map((provider) => (
                    <a
                        key={provider.slug}
                        className={`button${
                            disabledProviders.includes(provider.slug)
                                ? " disabled"
                                : ""
                        }`}
                        href={`http://localhost:3001/auth/${provider.slug}/login`}
                    >
                        Login with {provider.name}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default App;
