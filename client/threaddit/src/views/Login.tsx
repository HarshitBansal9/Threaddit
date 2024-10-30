import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios/axiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
    async function getAuthURL() {
        const response = await axiosInstance.get("/auth/google/url");
        window.location.href = response.data as string;
    }
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Button onClick={getAuthURL} className="px-8">
                Login with google
            </Button>
        </div>
    );
}

export default Login;
