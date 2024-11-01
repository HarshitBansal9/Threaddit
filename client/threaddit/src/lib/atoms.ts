import { atom } from "jotai";
import { User } from "./types";


export const usersAtom = atom<User[] >([]);
