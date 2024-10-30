import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "@/axios/axiosInstance";

function CallBack() {
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token");
    if (token) {
        axiosInstance.defaults.headers.jwt_token = token;
        localStorage.setItem("jwtToken", token);
        useEffect(() => {
            navigate("/");
        });
    }
    return <div></div>;
}

export default CallBack;
