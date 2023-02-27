import Ky from "ky";
import { deleteToken, getToken } from "../auth";

const api = Ky.create({
    prefixUrl: "http://localhost:3001",
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
