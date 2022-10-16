import { createRouter } from "./context";
import * as z from "zod";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt"

export const authRouter = createRouter()
    .mutation("register", {
        input: z.object({
            email: z.string().nullish(),
            username: z.string().nullish(),
            password: z.string().nullish(),
            cpassword: z.string().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {

            if(!input?.email || !input?.username || !input?.password || !input.cpassword) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "required parameter empty!"
                });
            }

            const userExistsPrisma = await ctx.prisma.user.findFirst({
                where: {
                    OR: [
                        {email: input.email},
                        {username: input.username}
                    ]
                }
            });
            
            if(userExistsPrisma) { 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Prisma Internal error",
                    message: "User with this email/username exists!"
                });
            }

            if(input.password !== input.cpassword) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "The Passwords that you entered do not match!"
                });
            }

            const saltRounds: number = process.env.SALT as unknown as number
            
            const salt = bcrypt.genSaltSync(saltRounds);

            const hash = bcrypt.hashSync(input.password, salt);

            await ctx.prisma.user.create({
                data: {
                    email: input.email,
                    username: input.username,
                    password: hash
                }
            });

            return {
                status: "User successfully registered!"
            }

        }
    })
    .mutation("login", {
        input: z.object({
            email: z.string().nullish(),
            password: z.string().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(!input?.email || !input?.password) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Input Error"
                });
            }

            const userExistsPrisma = await ctx.prisma.user.findFirst({
                where: {
                    email: input.email
                }
            });

            if(!userExistsPrisma) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "User does not exist"
                });
            }

            const $passMatch = bcrypt.compareSync(input.password, userExistsPrisma.password)

            if(!$passMatch) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Passwords don't match!"
                });
            }

            return {
                user: userExistsPrisma,
                message: "Successfully Logged in!"
            }
        }
    });