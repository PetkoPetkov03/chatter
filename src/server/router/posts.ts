import { createRouter } from "./context";
import * as z from "zod";
import { ThrowTRPCInputErrorHook, ThrowTRPCInternalErrorHook } from "./inputThrow";

export const posts = createRouter()
    .mutation("like&dislikePost", {
        input: z.object({
            id: z.string().cuid(),
            user_id: z.string().cuid(),
            option: z.boolean()
        }).nullish(),
        async resolve({ ctx, input }): Promise<void> {

            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            const checkIfLiked = await ctx.prisma.postsLikes.findFirst({
                where: {
                    postId: input.id,
                    userId: input.user_id
                }
            });

            const checkIfDisliked = await ctx.prisma.postsDislikes.findFirst({
                where: {
                    postId: input.id,
                    userId: input.user_id
                }
            });

            const createPLikes = async () => {
                await ctx.prisma.postsLikes.create({
                    data: {
                        postId: input.id,
                        userId: input.user_id
                    }
                });
            }

            const deletePLikes = async () => {
                await ctx.prisma.postsLikes.delete({
                    where: {
                        postId_userId: {
                            postId: input.id,
                            userId: input.user_id
                        }
                    }
                });
            }


            const createPDislikes = async () => {
                await ctx.prisma.postsDislikes.create({
                    data: {
                        postId: input.id,
                        userId: input.user_id
                    }
                });
            }

            const deletePDislikes = async () => {
                await ctx.prisma.postsDislikes.delete({
                    where: {
                        postId_userId: {
                            postId: input.id,
                            userId: input.user_id
                        }
                    }
                });
            }

            if (input.option === true) {

                if (!checkIfLiked && !checkIfDisliked) {
                    createPLikes();
                } else if (checkIfLiked && !checkIfDisliked) {
                    deletePLikes();
                } else if (!checkIfLiked && checkIfDisliked) {
                    deletePDislikes();
                    createPLikes();
                }

            } else if (input.option === false) {
                if (!checkIfLiked && !checkIfDisliked) {
                    createPDislikes();
                } else if (checkIfLiked && !checkIfDisliked) {
                    deletePLikes();
                    createPDislikes();
                } else if (!checkIfLiked && checkIfDisliked) {
                    deletePDislikes();
                }
            } else {
                throw ThrowTRPCInternalErrorHook();
            }
        }
    })
    .mutation("createComment", {
        input: z.object({
            id: z.string().cuid(),
            author_id: z.string().cuid(),
            content: z.string().nullish()
        }).nullish(),
        async resolve({ ctx, input }): Promise<void> {
            if(!input || typeof input.content !== "string" || input.content.length === 0) {
                throw ThrowTRPCInputErrorHook();
            }

            await ctx.prisma.comments.create({
                data: {
                    postId: input.id,
                    authorId: input.author_id,
                    content: input.content,                    
                }
            });

        }
    });