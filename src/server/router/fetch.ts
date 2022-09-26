import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

export const fetch = createRouter()
    .query("fetchUserById", {
        input: z.object({
            id: z.string().cuid().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(typeof input?.id !== "string"){
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing input"
                });
            }

            const user = await ctx.prisma.user.findFirst({
                where: {
                    id: input.id
                },
            });

            return {
                user: user
            }
        }
    })
    .query("fetchUser", {
        input: z.object({
            username: z.string().nullish()
        }).nullish(),

        async resolve({ input, ctx}) {
            if(!input?.username) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing input"
                });
            }

            const user = await ctx.prisma.user.findFirst({
                where: {
                    username: {
                        startsWith: input.username
                    }
                }
            });

            return {
                users: user
            };
        }
    })
    .query("fetchMultiple" , {
        input: z.object({
            ids: z.string().array()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing input"
                });
            }
            if(typeof input.ids !== typeof [""]) { 
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing input"
                });
            }

            const users = await ctx.prisma.user.findMany({
                where: {
                    id: {
                        in: input.ids
                    }
                },
                select: {
                    id: true,
                    username: true,
                }
            });

            return {
                users: users
            }
        }
    });