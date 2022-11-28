import * as z from "zod";
import type { Messages } from "@prisma/client";

export type User = {
    id: string,
    email: string,
    username: string,
    admin: boolean
} | undefined | null


export type UserPrisma = {
    id: string,
    email: string,
    username: string,
    admin: boolean,
    friends: string[]
} | undefined | null

export const UserSchema: z.ZodSchema<User> = z.object({
    id: z.string().cuid(),
    email: z.string(),
    username: z.string(),
    password: z.string(),
    admin: z.boolean(),
    chatrooms: z.string().array(),
    friends: z.string().array(),
    icon: z.string(),
    friendRequests: z.string().array()
});

export interface MObject {
    submiter: {
        id: string,
        messages: Messages[]
    },
    reported: {
        id: string,
        messages: Messages[]
    }
}