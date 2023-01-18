import { createRouter } from "./context";

import * as z from "zod";
import { MObject, UserPrisma, UserSchema } from "../../types/UserTypes";
import { Messages } from "@prisma/client";
import { ThrowTRPCInputErrorHook, ThrowTRPCAuthErrorHook } from "./inputThrow";


export const fetch = createRouter()
    .query("fetchUserById", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw ThrowTRPCInputErrorHook();
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

        async resolve({ input, ctx }) {
            if (!input?.username) {
                throw ThrowTRPCInputErrorHook();
            }

            const user: UserPrisma = await ctx.prisma.user.findFirst({
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
    .query("fetchMultiple", {
        input: z.object({
            ids: z.string().array().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            if (!input.ids) {
                throw ThrowTRPCInputErrorHook();
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
    })
    .query("fetchFriends", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {
            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const current_user = await ctx.prisma.user.findFirst({
                where: {
                    id: input.id
                },
                select: {
                    friends: true
                }
            });

            const friends = await ctx.prisma.user.findMany({
                where: {
                    id: {
                        in: current_user?.friends
                    }
                },
                select: {
                    id: true,
                    username: true
                }
            });

            return friends;
        }
    })
    .query("fetchMessagesAdmin", {
        input: z.object({
            sid: z.string().cuid(),
            rid: z.string().cuid(),
            user: UserSchema
        }).nullish(),
        async resolve({ ctx, input }) {

            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            if (typeof input.user?.admin !== "boolean" && input.user?.admin !== true) {
                throw ThrowTRPCAuthErrorHook();
            }

            const sMessages = await ctx.prisma.messages.findMany({
                where: {
                    senderId: input.sid
                }
            });

            const rMessages = await ctx.prisma.messages.findMany({
                where: {
                    senderId: input.rid
                }
            });

            const MessagesObj: MObject = {
                submiter: {
                    id: input.sid,
                    messages: sMessages
                },

                reported: {
                    id: input.rid,
                    messages: rMessages
                }
            }

            return {
                messages: MessagesObj
            }
        }
    })
    .query("fetchNotifications", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ input, ctx }) {

            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const notifications = await ctx.prisma.user.findFirst({
                where: {
                    id: input.id
                },
                select: {
                    notifications: true
                }
            });

            return {
                notifications: notifications?.notifications,
            }
        }
    })
    .mutation("setNotificationsToSeen", {
        input: z.object({
            notifications: z.object({
                id: z.string(),
                userId: z.string(),
                user: z.any(),
                contend: z.string(),
                seen: z.boolean()
            }).array()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook();
            }

            await ctx.prisma.notification.updateMany({
                where: {
                    id: {
                        in: input.notifications.map((notification) => {return notification.id})
                    }
                },
                data: {
                    seen: true
                }
            });

            return {
                code: 200
            }
        }
    })
    .mutation("removeNotification", {
        input: z.object({
            id: z.string()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook();
            }

            await ctx.prisma.notification.delete({
                where: {
                    id: input.id
                }
            });

            return {
                code: 200
            }
        }
    });