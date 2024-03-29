import { createRouter } from "./context";

import * as z from "zod";
import { MObject, UserPrisma, UserSchema } from "../../types/UserTypes";
import { Messages } from "@prisma/client";
import { ThrowTRPCInputErrorHook, ThrowTRPCAuthErrorHook } from "./inputThrow";
import { CheckIfLDType } from "../../types/queryTypes";


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
            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            await ctx.prisma.notification.updateMany({
                where: {
                    id: {
                        in: input.notifications.map((notification) => { return notification.id })
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
            if (!input) {
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
    })
    .query("fetchPosts", {
        input: z.object({
            userId: z.string().cuid().nullish(),
            reloader: z.number()
        }).nullish(),

        async resolve({ ctx, input }) {
            if (typeof input?.userId === "undefined" || input.userId === null) {
                return {
                    code: 200,
                    message: "Unable to fetch posts"
                }
            }

            const friends = await ctx.prisma.user.findFirst({
                where: {
                    id: input.userId
                },
                select: {
                    friends: true
                }
            });

            if (typeof friends === "undefined" || friends === null) {
                return {
                    code: 200,
                    message: "Unable to fetch posts"
                }
            }

            const friends_posts = await ctx.prisma.user.findMany({
                where: {
                    id: {
                        in: friends.friends
                    }
                },
                select: {
                    posts: {
                        select: {
                            id: true,
                            author: true,
                            _count: {
                                select: {
                                    post_likes: true,
                                    post_dislikes: true
                                }
                            },
                            date: true,
                            image: true,
                            description: true,
                            title: true
                        }
                    },
                    username: true,
                    icon: true,
                },
                take: 10+input.reloader
            });

            return {
                code: 200,
                posts: friends_posts
            }
        }
    })
    .query("fetchLikes", {
        input: z.object({
            users_posts_map: z.map(z.string().cuid(), z.string().array()),
        }).nullish(),
        async resolve({ ctx, input }) {
            return {
                
            }
        }
    })
    .query("fetchFocusPost", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {

            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const post = await ctx.prisma.posts.findFirst({
                where: {
                    id: input.id
                }
            });

            return {
                code: 200,
                post: post
            }
        }
    })
    .query("fetchSPostLikesDislikes", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const likes = await ctx.prisma.postsLikes.count({
                where: {
                    postId: input.id
                }
            });

            const dislikes = await ctx.prisma.postsDislikes.count({
                where: {
                    postId: input.id
                }
            });


            type LD = {
                likes: number,
                dislikes: number
            };

            const likesDislikesObject: LD = {
                likes,
                dislikes
            }

            return likesDislikesObject;
        }
    })
    .query("checkIfLD", {
        input: z.object({
            user_id: z.string().cuid(),
            post_id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }): Promise<CheckIfLDType> {

            if(!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const checkedObject: CheckIfLDType = {
                like: false,
                dislike: false
            }

            const checkIfLikedOrDisliked = await ctx.prisma.posts.findFirst({
                where: {
                    id: input.post_id,
                },
                select: {
                    post_likes: {
                        where: {
                            userId: input.user_id
                        },
                    },
                    post_dislikes: {
                        where: {
                            userId: input.user_id
                        },
                    },
                }
            });

            if(typeof checkIfLikedOrDisliked?.post_likes[0] !== "undefined") {
                checkedObject.like = true;
            }else if(typeof checkIfLikedOrDisliked?.post_dislikes[0] !== "undefined") {
                checkedObject.dislike = true;
            }
            

            return checkedObject
        }
    })
    .query("fetchPostsProfile", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {

            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const posts = await ctx.prisma.posts.findMany({
                where: {
                    authorId: {
                        in: input.id
                    }
                }
            });

            return {
                code: 200,
                posts: posts
            }
        }
    })
    .query("fetchComments", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const comments = await ctx.prisma.posts.findFirst({
                where: {
                    id: input.id
                },

                select: {
                    comments: true
                }
            });

            return comments;
        }
    });