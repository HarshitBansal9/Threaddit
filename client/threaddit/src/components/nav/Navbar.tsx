import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";

import React from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import { Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/App";

function Navbar() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuthState();
    return (
        <div className="sticky inset-x-0 top-0 z-50 flex flex-row h-16 w-full items-center border-b bg-background/75 px-4 backdrop-blur-lg transition-all">
            <Pen color="white" className="w-6 h-6 mr-2 text-accent" />
            <RouterLink
                to="/"
                className="flex items-center gap-2 text-xl font-bold"
            >
                Threaddit
            </RouterLink>

            <Menubar className="ml-auto border-none gap-4 text-xl">
                <MenubarMenu>
                    <MenubarTrigger
                        onClick={() => {
                            navigate("/rooms");
                        }}
                    >
                        Rooms
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Profile</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Create</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Profiles</MenubarTrigger>
                </MenubarMenu>
                {isLoggedIn && (
                    <MenubarMenu>
                        <MenubarTrigger onClick={() => logout()}>
                            Logout
                        </MenubarTrigger>
                    </MenubarMenu>
                )}
            </Menubar>
        </div>
    );
}

export default Navbar;
