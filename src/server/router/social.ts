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
            searchQuery: z.string().nullish(),
            current_user_friends: z.string().array().nullish()
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
                                not: input.user.username,
                            }
                        },

                        {
                            NOT: {
                                notifications: {
                                    has: input.user.id
                                }
                            },
                        }
                    ]
                },
                select: {
                    id: true,
                    username: true
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
    }).query("fetchNotifications", {
        input: z.object({
            id: z.string().cuid().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(typeof input?.id !== "string") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Type of Value not valid"
                });
            }

            const notifications = await ctx.prisma.user.findMany({
                where: {
                    id: input.id
                },
                select: {
                    notifications: true
                }
            });

            console.log(notifications[0]);
            
            return notifications[0]!
        }
    })
    .mutation("acceptFriendRequest", {
        input: z.object({
            req_user_id: z.string().cuid().nullish(),
            curr_user_id: z.string().cuid().nullish()
        }).nullish(),

        async resolve( { input, ctx } ) {
            if(typeof input?.curr_user_id !== "string" || typeof input.req_user_id !== "string") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Type of Value not valid"
                });
            }

            const current_user_friends_notif = await ctx.prisma.user.findFirst({
                where: {
                    id: input.curr_user_id
                },
                select: {
                    notifications: true,
                    friends: true
                }
            });

            const requested_user_friends_notif = await ctx.prisma.user.findFirst({
                where: {
                    id: input.req_user_id
                },
                select: {
                    notifications: true,
                    friends: true
                }
            });

            if(!current_user_friends_notif) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing"
                });
            }

            if(!requested_user_friends_notif) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing"
                });
            }

            const req_user_notifications = requested_user_friends_notif.notifications.map(notif => {
                if(notif !== input.curr_user_id) {
                    return notif
                }
                return "";
            });

            const current_user_notifications = current_user_friends_notif.notifications.map(notif => {
                if(notif !== input.req_user_id) {
                    return notif
                }
                return "";
            });

            if(!current_user_notifications) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing"
                });
            }

            if(!req_user_notifications) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing"
                });
            }

            await ctx.prisma.user.update({
                where: {
                    id: input.curr_user_id
                },
                data: {
                    friends: [input.req_user_id, ...current_user_friends_notif.friends],
                    notifications: current_user_notifications
                }
            });

            await ctx.prisma.user.update({
                where: {
                    id: input.req_user_id
                },
                data: {
                    friends: [input.curr_user_id, ...requested_user_friends_notif.friends],
                    notifications: req_user_notifications
                }
            });

            return {
                id: input.req_user_id,
                message: "User friend Request accepted"
            }
        }
    })
    .mutation("unfriend", {
        input: z.object({
            user_id: z.string().cuid().nullish(),
            req_user_id: z.string().cuid().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(typeof input?.req_user_id !== "string" || typeof input.user_id !== "string") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Type of Value not valid"
                });
            }

            const current_user_friends = await ctx.prisma.user.findFirst({
                where: {
                    id: input.user_id
                },
                select: {
                    friends: true
                }
            });

            if(!current_user_friends) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR"
                });
            }

            const new_friend_list = current_user_friends.friends.map(id => {
                if(id !== input.req_user_id) { 
                    return id
                }else {
                    return ""
                }
            });

            await ctx.prisma.user.update({
                where: {
                    id: input.user_id
                },
                data: {
                    friends: new_friend_list
                }
            });

            return {
                id: input.req_user_id,
                message: "Friend removed"
            }
        }
    });