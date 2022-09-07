import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import * as z from "zod";

export const socialRouter = createRouter()
    .query("searchEngine", {
        input: z.object({
            user: z.object({
                id: z.string().nullish(),
                email: z.string().nullish(),
                username: z.string().nullish(),
                admin: z.string().nullish()
            }).nullish(),
            searchQuery: z.string().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(!input?.searchQuery) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "No search query"
                });
            }

            if(!input.user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Pass a user"
                });
            }

            if (
                !input.user.admin ||
                !input.user.email ||
                !input.user.id ||
                !input.user.username
                ) { 
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        cause: "Authorization",
                        message: "Cookie Error"
                    });
            }

            const users = ctx.prisma.user.findMany({
                where: {
                    username: {
                        startsWith: input.searchQuery,
                        not: input.user.username
                    }
                }
            });

            return {
                searchResults: users
            };
        }
    });