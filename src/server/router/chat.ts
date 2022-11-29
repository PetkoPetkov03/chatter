import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { ThrowTRPCAuthErrorHook, ThrowTRPCInputErrorHook, ThrowTRPCInternalErrorHook } from "./inputThrow";


export const chatRouter = createRouter()
    .mutation("createChatRoom", {
        input: z.object({
            adminId: z.string().cuid(),
            name: z.string(),
            listOfUsers: z.string().cuid().array()
        }).nullish(),
        async resolve({ ctx, input }) {
            if (!input) {
                throw ThrowTRPCInputErrorHook();
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
                throw ThrowTRPCInputErrorHook();
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
                throw ThrowTRPCInputErrorHook();
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
                throw ThrowTRPCInputErrorHook();
            }

            if(input.content[0] === "!" && input.content[1] === "@") {
                const messagePing = input.content.slice(2, input.content.length).split(" ");

                const User = await ctx.prisma.user.findFirst({
                    where: {
                        username: messagePing[0]
                    },
                    select: {
                        id: true
                    }
                });

                const SenderUser = await ctx.prisma.user.findFirst({
                    where: {
                        id: input.senderId
                    },
                    select: {
                        username: true
                    }
                });

                if(!User) {
                    throw ThrowTRPCInternalErrorHook();
                }

                if(!SenderUser) {
                    throw ThrowTRPCInternalErrorHook();
                }

                await ctx.prisma.notification.create({
                    data: {
                        userId: User.id,
                        contend: `${SenderUser.username}: ${input.content}`,
                    }
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
                throw ThrowTRPCInputErrorHook();
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
                throw ThrowTRPCAuthErrorHook();
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
                throw ThrowTRPCInputErrorHook();
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
    })
    .mutation("addParticipants", {
        input: z.object({
            user_id: z.string().cuid(),
            chatroom_id: z.string().cuid(),
            list_of_new_participants: z.string().cuid().array()
        }).nullish(),
        async resolve({ input, ctx }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook()
            }

            const User = await ctx.prisma.user.findFirst({
                where: {
                    id: input.user_id
                }
            });

            const Chatroom = await ctx.prisma.chatrooms.findFirst({
                where: {
                    id: input.chatroom_id
                }
            });

            if(!User) {
                throw ThrowTRPCInternalErrorHook();
            }

            if(!Chatroom) {
                throw ThrowTRPCInternalErrorHook();
            }

            const new_list_of_participants: string[] = Chatroom.participants;

            input.list_of_new_participants.forEach((participant) => new_list_of_participants.push(participant));

            await ctx.prisma.chatrooms.update({
                where: {
                    id: Chatroom.id
                },
                data: {
                    participants: new_list_of_participants
                }
            });

            return {
                username: User.username,
                listofparticipants: input.list_of_new_participants
            }
        }
    });