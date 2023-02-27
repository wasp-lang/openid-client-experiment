export function setToken(token: string): void {
    localStorage.setItem("token", token);
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function deleteToken(): void {
    localStorage.removeItem("token");
}
