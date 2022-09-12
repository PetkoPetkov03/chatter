import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import * as z from "zod";

export const socialRouter = createRouter()
    .query("searchEngine", {
        input: z.object({
            user: z.object({
                id: z.string().cuid({ message: "invalid id" }).nullish(),
                email: z.string().email({ message: "invalid email" }).nullish(),
                username: z.string().nullish(),
                admin: z.boolean().nullish()
            }).nullish(),
            searchQuery: z.string().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input?.searchQuery) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "No search query"
                });
            }

            if (!input.user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Pass a user"
                });
            }

            if (
                !input.user.username ||
                !input.user.id ||
                !input.user.email ||
                typeof input.user.admin !== "boolean"
            ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Authorization",
                    message: "Cookie Error"
                });
            }


            const users = await ctx.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            username: {
                                startsWith: input.searchQuery,
                                not: input.user.username
                            }
                        },

                        {
                            NOT: {
                                notifications: {
                                    has: input.user.id
                                }
                            }
                        }
                    ]
                }
            });

            return {
                searchResults: users
            };
        }
    })
    .mutation("sendFriendRequest", {
        input: z.object({
            requested_user_id: z.string().cuid({ message: "invalid id" }).nullish(),
            current_user_id: z.string().cuid({ message: "invalid id" }).nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "no valid parameters"
                });
            }

            if (typeof input.current_user_id !== "string" || typeof input.requested_user_id !== "string") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Arguments not a valid type!"
                });
            }

            const requested_user_notifications = await ctx.prisma.user.findFirst({
                where: {
                    id: input.requested_user_id
                },

                select: {
                    notifications: true
                }
            });

            if (!requested_user_notifications?.notifications) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Prisma",
                    message: "Error with user query"
                });
            }

            await ctx.prisma.user.update({
                where: {
                    id: input.requested_user_id
                },
                data: {
                    notifications: [input.current_user_id, ...requested_user_notifications.notifications]
                }
            });

            return {
                id: input.requested_user_id,
                message: "Friend Request sent"
            }
        }
    })
    .query("fetchNotif", {
        input: z.object({
            user: z.object({
                id: z.string().cuid({ message: "invalid id" }).nullish(),
                email: z.string().email({ message: "invalid email address" }).nullish(),
                username: z.string().nullish(),
                admin: z.boolean().nullish()
            }).nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input?.user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "No valid input"
                });
            }

            if
                (typeof input.user.admin !== "boolean" ||
                typeof input.user.email !== "string" ||
                typeof input.user.id !== "string" ||
                typeof input.user.username !== "string") {

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Type of Value not valid"
                });
            }

            const notifications = await ctx.prisma.user.findMany({
                where: {
                    id: input.user.id
                },
                select: {
                    notifications: true
                }
            });

            if (!notifications) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Database",
                    message: "database cant find notifications"
                });
            }
            return {
                notifications: notifications[0]?.notifications
            }
        }
    })
    .mutation("showFriendRequest", {
        input: z.object({
            ids: z.string().array().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "No valid input"
                });
            }

            if (!input.ids) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Type of Value not valid"
                });
            }

            const showFriendRequest = await ctx.prisma.user.findMany({
                where: {
                    id: {
                        in: input.ids
                    }
                },

                select: {
                    id: true,
                    username: true
                }
            })

            return {
                requests: showFriendRequest
            }
        }
    });