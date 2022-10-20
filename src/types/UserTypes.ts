import * as z from "zod";

export type User = {
    id: string,
    email: string,
    username: string,
    admin: boolean
} | undefined

export const UserSchema: z.ZodSchema<User> = z.object({
    id: z.string().cuid(),
    email: z.string(),
    username: z.string(),
    password: z.string(),
    admin: z.boolean(),
    chatrooms: z.string().array(),
    friends: z.string().array(),
    icon: z.string(),
    notifications: z.string().array()
});