import { v4 as uuid } from "uuid";

function createMockUserDB() {
    const users: User[] = [];

    return {
        findBy<K extends keyof User>(key: K, value: User[K]) {
            return users.find((user) => user[key] === value);
        },
        create: (user: Omit<User, "id">) => {
            users.push({
                id: uuid(),
                ...user
            });
            return user;
        },
        findByProviderId: (providerId: User["providerId"]) =>
            users.find((user) => user.providerId === providerId)
    };
}

export const users = createMockUserDB();

export type User = {
    id: string;
    email: string;
    provider: string;
    providerId: string;
    userInfo: { [key: string]: any };
};
