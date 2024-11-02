import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Home, { fetcher } from "./views/Home";
import Rooms from "./views/Rooms";
import Login from "./views/Login";
import CallBack from "./views/CallBack";
import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { axiosInstance } from "./axios/axiosInstance";
import { Loader } from "lucide-react";
import { myUserAtom } from "./lib/atoms";
import { set } from "react-hook-form";


//initial state before any page loads
const token = localStorage.getItem("jwtToken");
const auth = atom({
    token,
    isLoggedIn: false,
});

export function useAuthState() {
    const [authState, setAuthState] = useAtom(auth);
    const { token, isLoggedIn } = authState;
    const [myUser,setMyUser] = useAtom(myUserAtom);

    const LOCAL_STORAGE_TOKEN_KEY = "jwtToken";

    const initAuthState = useCallback(
        //right after logging in set this,other it will be still in the state of "logged out" where token is undefined and isLoggedIn is false => it will show the login page
        async (token: string) => {
            setAuthState({
                token,
                isLoggedIn: false,
            });

            // Store the token in localStorage
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
            // Set the JWT token in Axios default headers
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            //here will be the get user profile route ,try catch and call logout in case of error (as that means the token is not verified).
            try {
                const response = await axiosInstance.get(
                    "api/users/getmydetails"
                );
                setMyUser(response.data.data[0]);
                console.log("MY details", response.data);
                setAuthState({
                    token,
                    isLoggedIn: true,
                });
            } catch (error) {
                logout();
            }

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
        axiosInstance.interceptors.response.use(
        ), function (error:any) {
            console.log("error", error);
            if (error.response.status === 401) {
                logout();
            }
            return Promise.reject(error);
        }
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
