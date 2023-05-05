import Ky from "ky";
import { deleteToken, getToken } from "../auth";
import { env } from "../env";

const api = Ky.create({
    prefixUrl: env.VITE_SERVER_URL,
    credentials: "include",
    hooks: {
        beforeRequest: [
            (request) => {
                const token = getToken();
                if (!token) {
                    return;
                }
                request.headers.set("Authorization", `Bearer ${token}`);
            }
        ],
        afterResponse: [
            async (request, options, response) => {
                if (response.status === 401) {
                    deleteToken();
                }
            }
        ]
    }
});

export default api;
