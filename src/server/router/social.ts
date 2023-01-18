
import { createRouter } from "./context";
import * as z from "zod";
import { UserSchema } from "../../types/UserTypes";
import { TRPCError } from "@trpc/server";
import { ThrowTRPCAuthErrorHook, ThrowTRPCInputErrorHook } from "./inputThrow";
import { Sql } from "@prisma/client/runtime";

export const socialRouter = createRouter()
    .query("searchEngine", {
        input: z
            .object({
                user: z
                    .object({
                        id: z.string().cuid({ message: "invalid id" }).nullish(),
                        email: z.string().email({ message: "invalid email" }).nullish(),
                        username: z.string().nullish(),
                        admin: z.boolean().nullish(),
                    })
                    .nullish(),
                searchQuery: z.string().nullish(),
                current_user_friends: z.string().array().nullish(),
            })
            .nullish(),

        async resolve({ input, ctx }) {
            if (!input?.searchQuery) {
                throw ThrowTRPCInputErrorHook();
            }

            if (!input.user) {
                throw ThrowTRPCInputErrorHook();
            }

            if (
                !input.user.username ||
                !input.user.id ||
                !input.user.email ||
                typeof input.user.admin !== "boolean"
            ) {
                throw ThrowTRPCAuthErrorHook();
            }

            const users = await ctx.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            username: {
                                startsWith: input.searchQuery,
                                not: input.user.username,
                                mode: "insensitive"
                            },
                        },

                        {
                            NOT: [
                               { friendRequests: {
                                    has: input.user.id,
                                }},
                                {
                                    friends: {
                                        has: input.user.id
                                    }
                                }
                            ]
                        },
                    ],
                },
                select: {
                    id: true,
                    username: true,
                },
            });

            return {
                searchResults: users,
            };
        },
    })
    .mutation("sendFriendRequest", {
        input: z
            .object({
                requested_user_id: z.string().cuid({ message: "invalid id" }).nullish(),
                current_user_id: z.string().cuid({ message: "invalid id" }).nullish(),
            })
            .nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            if (
                typeof input.current_user_id !== "string" ||
                typeof input.requested_user_id !== "string"
            ) {
                throw ThrowTRPCInputErrorHook();
            }

            const requested_user_friendRequests = await ctx.prisma.user.findFirst({
                where: {
                    id: input.requested_user_id,
                },

                select: {
                    friendRequests: true,
                },
            });

            if (!requested_user_friendRequests?.friendRequests) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Prisma",
                    message: "Error with user query",
                });
            }

            const current_user_friendRequests = await ctx.prisma.user.findFirst({
                where: {
                    id: input.current_user_id
                },

                select: {
                    friendRequests: true
                }
            });

            if(current_user_friendRequests?.friendRequests.includes(input.requested_user_id)) {
                return {
                    message: "User is already in your friendRequests!"
                }
            }

            await ctx.prisma.user.update({
                where: {
                    id: input.requested_user_id,
                },
                data: {
                    friendRequests: [
                        input.current_user_id,
                        ...requested_user_friendRequests.friendRequests,
                    ],
                },
            });

            return {
                id: input.requested_user_id,
                message: "Friend Request sent",
            };
        },
    })
    .query("fetchfriendRequests", {
        input: z
            .object({
                id: z.string().cuid().nullish(),
            })
            .nullish(),

        async resolve({ input, ctx }) {
            if (typeof input?.id !== "string") {
                throw ThrowTRPCInputErrorHook();
            }

            const friendRequests = await ctx.prisma.user.findMany({
                where: {
                    id: input.id,
                },
                select: {
                    friendRequests: true,
                },
            });

            return friendRequests[0];
        },
    })
    .mutation("acceptFriendRequest", {
        input: z
            .object({
                req_user_id: z.string().cuid().nullish(),
                curr_user_id: z.string().cuid().nullish(),
            })
            .nullish(),

        async resolve({ input, ctx }) {
            if (
                typeof input?.curr_user_id !== "string" ||
                typeof input.req_user_id !== "string"
            ) {
                throw ThrowTRPCInputErrorHook();
            }

            const current_user_friends_notif = await ctx.prisma.user.findFirst({
                where: {
                    id: input.curr_user_id,
                },
                select: {
                    friendRequests: true,
                    friends: true,
                },
            });

            const requested_user_friends_notif = await ctx.prisma.user.findFirst({
                where: {
                    id: input.req_user_id,
                },
                select: {
                    friendRequests: true,
                    friends: true,
                },
            });

            if (!current_user_friends_notif) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing",
                });
            }

            if (!requested_user_friends_notif) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing",
                });
            }

            const req_user_friendRequests =
                requested_user_friends_notif.friendRequests.filter((notif) => notif !== input.curr_user_id);

            const current_user_friendRequests =
                current_user_friends_notif.friendRequests.filter((notif) => notif !== input.req_user_id);

            if (!current_user_friendRequests) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing",
                });
            }

            if (!req_user_friendRequests) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: "Data missing",
                });
            }

            await ctx.prisma.user.update({
                where: {
                    id: input.curr_user_id,
                },
                data: {
                    friends: [input.req_user_id, ...current_user_friends_notif.friends],
                    friendRequests: current_user_friendRequests,
                },
            });

            await ctx.prisma.user.update({
                where: {
                    id: input.req_user_id,
                },
                data: {
                    friends: [
                        input.curr_user_id,
                        ...requested_user_friends_notif.friends,
                    ],
                    friendRequests: req_user_friendRequests,
                },
            });

            return {
                id: input.req_user_id,
                message: "User friend Request accepted",
            };
        },
    })
    .mutation("unfriend", {
        input: z
            .object({
                user_id: z.string().cuid().nullish(),
                req_user_id: z.string().cuid().nullish(),
            })
            .nullish(),

        async resolve({ input, ctx }) {
            if (
                typeof input?.req_user_id !== "string" ||
                typeof input.user_id !== "string"
            ) {
                throw ThrowTRPCInputErrorHook();
            }

            const current_user_friends = await ctx.prisma.user.findFirst({
                where: {
                    id: input.user_id,
                },
                select: {
                    friends: true,
                },
            });

            const req_user_friends = await ctx.prisma.user.findFirst({
                where: {
                    id: input.req_user_id
                },
                select: {
                    friends: true
                }
            });

            if(!req_user_friends) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            const new_req_user_list: string[] = req_user_friends.friends.filter((id) => id !== input.user_id);

            if (!current_user_friends) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            const new_friend_list: string[] = current_user_friends.friends.filter((id) => id !== input.req_user_id);

            await ctx.prisma.user.update({
                where: {
                    id: input.req_user_id
                },
                data: {
                    friends: new_req_user_list
                }
            });

            await ctx.prisma.user.update({
                where: {
                    id: input.user_id,
                },
                data: {
                    friends: new_friend_list,
                },
            });

            return {
                id: input.req_user_id,
                message: "Friend removed",
            };
        },
    })
    .mutation("report", {
        input: z
            .object({
                id: z.string().cuid().nullish(),
                repType: z.string().nullish(),
                description: z.string().nullish(),
                user: UserSchema
            })
            .nullish(),

        async resolve({ input, ctx }) {
            // TODO Introduce Report Logic
            if (typeof input?.description !== "string" || typeof input.id !== "string" || typeof input.repType !== "string" || typeof input.user?.id !== "string") {
                throw ThrowTRPCInputErrorHook();
            }

            
            await ctx.prisma.reports.create({
                data: {
                    message: input.description,
                    userId: input.user.id,
                    submiterId: input.id,
                    reportType: input.repType,
                }
            });

            return {
                message: "Report sent!",
            };
        }
    })
    .query("fetchIcon", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input || typeof input.id === "undefined") {
                throw ThrowTRPCInputErrorHook()
            }

            const imagePath = await ctx.prisma.user.findFirst({
                where: {
                    id: input.id
                },
                select: {
                    icon: true
                }
            });

            return {
                imagePath: imagePath
            }
        }
    })
    .mutation("ignoreFriendRequest", {
        input: z.object({
            id: z.string().cuid(),
            request:z.string().cuid()
        }).nullish(),
        async resolve({ input, ctx }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const {id, request} = input;

            const friendRequests = await ctx.prisma.user.findFirst({
                where: {
                    id: id
                },
                select: {
                    friendRequests: true
                }
            });

            await ctx.prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    friendRequests: friendRequests?.friendRequests.filter((id) => id !== request)
                }
            });

            return {
                status: 200
            }
        }
    })
    .mutation("createPost", {
        input: z.object({
            id: z.string().cuid().nullish(),
            title: z.string(),
            description: z.string(),
            image: z.string().array()
        }).nullish(),
        async resolve({ input, ctx }) {
            if(!input || !input.id) {
                throw ThrowTRPCInputErrorHook();
            }

            await ctx.prisma.posts.create({
                data: {
                    title: input.title,
                    description: input.description,
                    image: input.image,
                    author: {
                        connect: {
                            id: input.id
                        }
                    }
                }
            });

            return {
                status: 201
            }
        }
    });