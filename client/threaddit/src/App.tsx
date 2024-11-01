import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Home from "./views/Home";
import Rooms from "./views/Rooms";
import Login from "./views/Login";
import CallBack from "./views/CallBack";
import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { axiosInstance } from "./axios/axiosInstance";
import { Loader } from "lucide-react";


//initial state before any page loads
const token = localStorage.getItem("jwtToken");
const auth = atom({
    token,
    isLoggedIn: false,
});

const sleep = (timeout: number) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

export function useAuthState() {
    const [authState, setAuthState] = useAtom(auth);
    const { token, isLoggedIn } = authState;

    const LOCAL_STORAGE_TOKEN_KEY = "jwtToken";

    const initAuthState = useCallback(
        //right after logging in set this,other it will be still in the state of "logged out" where token is undefined and isLoggedIn is false => it will show the login page
        async (token: string) => {
            setAuthState({
                token,
                isLoggedIn: false,
            });

            //here will be the get user profile route ,try catch and call logout in case of error (as that means the token is not verified).
            await sleep(2000);
            // Store the token in localStorage
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
            // Set the JWT token in Axios default headers
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;


            //setting authState to loggedIn
            setAuthState({
                token,
                isLoggedIn: true,
            });
        },
        [setAuthState]
    );

    //also returns this which can be called from logout in the navbar
    const logout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        delete axiosInstance.defaults.headers.common["Authorization"];

        //logged out state
        setAuthState({
            token: "",
            isLoggedIn: false,
        });
    }, [setAuthState]);

    //for the case when you refresh the page as isLoggedIn will be set to false again
    useEffect(() => {
        if (token && !isLoggedIn) {
            initAuthState(token);
        }
    }, [token]);

    return {
        isLoggedIn: authState.isLoggedIn,
        initAuthState,
        isLoading: token && !isLoggedIn,
        logout,
    };
}


function App() {
    const { isLoggedIn, isLoading } = useAuthState();

    return (
        <BrowserRouter>
            <Navbar />
            {isLoading ? (
                <Loader />
            ) : isLoggedIn ? (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms" element={<Rooms />} />
                    {/* <Route path="/login" element={<Login />} /> */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/callback" element={<CallBack />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;
