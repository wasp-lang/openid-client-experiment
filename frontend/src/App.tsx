import { useState, useEffect } from "react";
import waspLogo from "./assets/wasp.svg";
import "./App.css";
import { getUser } from "./api/auth";
import { deleteToken } from "./auth";
import { JsonViewer } from "@textea/json-viewer";

type User = Awaited<ReturnType<typeof getUser>>;

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
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
            <div style={{ display: "flex", gap: "1rem" }}>
                <a
                    className="button"
                    href="http://localhost:3001/auth/google/login"
                >
                    Login with Google
                </a>
                <a
                    className="button"
                    href="http://localhost:3001/auth/github/login"
                >
                    Login with GitHub
                </a>
                <a
                    className="button disabled"
                    href="http://localhost:3001/auth/facebook/login"
                >
                    Login with Facebook
                </a>
                <a
                    className="button"
                    href="http://localhost:3001/auth/microsoft/login"
                >
                    Login with Microsoft
                </a>
            </div>
        </div>
    );
}

export default App;
