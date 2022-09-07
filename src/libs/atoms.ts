import { atom } from "recoil";
import type { User } from "../types/UserTypes";

export const userState = atom({
    key: "user",
    default: undefined as User
});