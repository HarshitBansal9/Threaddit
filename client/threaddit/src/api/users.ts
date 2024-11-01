import { axiosInstance } from "@/axios/axiosInstance";
import useSWR from "swr";

function useUserList() {
    const { data, error, isLoading } = useSWR("/api/users/get", async (url) => {
        const res = await axiosInstance.get(url);
        return res.data;
    });

    return {
        users: data,
    };
}
