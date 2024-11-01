import React, { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "@/axios/axiosInstance";
import { useAuthState } from "@/App";

function CallBack() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { initAuthState } = useAuthState();

    if (token) {
        initAuthState(token);
        return <Navigate to="/" />;
    } else {
        return <Navigate to="/login" />;
    }
}

export default CallBack;
