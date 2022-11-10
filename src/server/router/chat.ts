import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import type { Chatrooms } from "@prisma/client";


export const chatRouter = createRouter()
    .mutation("createChatRoom", {
        input: z.object({
            adminId: z.string().cuid(),
            name: z.string(),
            listOfUsers: z.string().cuid().array()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Input",
                    message: "Wrong input type!"
                });
            }

            await ctx.prisma.chatrooms.create({
                data: {
                 adminId: input.adminId,
                 name: input.name,
                 participants: input.listOfUsers,
                }
            });

            return {
                status: 200,
                message: "room created"
            }
        }
    })
    .query("fetchChatrooms", {
        input: z.object({
            id: z.string()
        }).nullish(),
        async resolve({ctx, input}) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Input",
                    message: "Wrong input type!"
                });
            }

            const chatrooms = await ctx.prisma.chatrooms.findMany({
                where: {
                    participants: {
                        has: input.id
                    }
                }
            });

            return {
                chatrooms: chatrooms
            }
        }
    })
    .query("fetchMessages", {
        input: z.object({
            id: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Input",
                    message: "Wrong input type!"
                });
            }

            const messages = await ctx.prisma.chatrooms.findFirst({
                where: {
                    id: input.id
                },

                select: {
                    messages: true
                }
            });

            return {
                messages: messages
            }
        }
    })
    .mutation("createMessage", {
        input: z.object({
            chatroomId: z.string().cuid(),
            senderId: z.string().cuid(),
            senderName: z.string(),
            content: z.string()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Input",
                    message: "Wrong input type!"
                });
            }
            await ctx.prisma.messages.create({
                data: {
                    content: input.content,
                    senderId: input.senderId,
                    chatroom: {
                        connect: {
                            id: input.chatroomId
                        }
                    },
                    senderName: input.senderName
                }
            });
            return {
                status: 202
            }
        }
    })
    .mutation("deleteChatroom", {
        input: z.object({
            currUserId: z.string().cuid(),
            chatroomId: z.string().cuid()
        }).nullish(),
        async resolve({ ctx, input }) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Input",
                    message: "Wrong input type!"
                });
            }

            const chatroom = await ctx.prisma.chatrooms.findFirst({
                where: {
                    id: input.chatroomId
                },
                select: {
                    participants: true,
                    adminId: true
                }
            });

            if(!chatroom) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Coudn't find chatroom!"
                });
            }

            if(chatroom.adminId !== input.currUserId) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Current user is not the chatrooms admin!"
                });
            }

            await ctx.prisma.chatrooms.delete({
                where: {
                    id: input.chatroomId
                }
            });

            return {
                message: "Chatroom removed!"
            };
        }
    });