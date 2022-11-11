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
            if (!input) {
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
        async resolve({ ctx, input }) {
            if (!input) {
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
            if (!input) {
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
            if (!input) {
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
            if (!input) {
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

            if (!chatroom) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Coudn't find chatroom!"
                });
            }

            if (chatroom.adminId !== input.currUserId) {
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
    })
    .mutation("leaveChatroom", {
        input: z.object({
            chatroomId: z.string().cuid(),
            currentUserId: z.string().cuid(),
            futureAdminId: z.string().cuid().nullable()
        }).nullish(),
        async resolve({ ctx, input }) {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "Input",
                    message: "Wrong input type!"
                });
            }

            const participants_and_admins = await ctx.prisma.chatrooms.findFirstOrThrow({
                where: {
                    id: input.chatroomId
                },
                select: {
                    participants: true,
                    adminId: true
                }
            });

            let adminId = participants_and_admins.adminId;

            const newListOfParticipants = participants_and_admins.participants.filter((participant) => participant !== input.currentUserId);

            if(!newListOfParticipants || newListOfParticipants.length === 0) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to reconstruct participants list!"
                });
            }

            await ctx.prisma.chatrooms.update({
                where: {
                    id: input.chatroomId
                },
                data: {
                    participants: newListOfParticipants
                }
            });

            if(adminId === input.currentUserId){
                if(typeof input.futureAdminId !== "string"){
                    adminId = newListOfParticipants[0] as string;
                }else{
                    adminId = input.futureAdminId;
                }

                await ctx.prisma.chatrooms.update({
                    where: {
                        id: input.chatroomId
                    },
                    data: {
                        adminId: adminId
                    }
                });
            }

            return {
                message: "You left the chatroom!"
            }
        }
    });