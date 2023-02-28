import { useQuery } from "react-query";
import { getProviders, getUser } from "../api/auth";
import { queryClient } from "../main";

const userQueryKey = "getUser";

export function useUser() {
    const queryInfo = useQuery(userQueryKey, getUser, {
        retry: false,
        refetchOnWindowFocus: false
    });

    return {
        user: queryInfo.data,
        ...queryInfo
    };
}

export function removeUser() {
    queryClient.invalidateQueries(userQueryKey);
    queryClient.removeQueries(userQueryKey);
}

export function useProviders() {
    const queryInfo = useQuery("getProviders", getProviders, {
        retry: false,
        refetchOnWindowFocus: false
    });

    return {
        providers: queryInfo.data,
        ...queryInfo
    };
}
