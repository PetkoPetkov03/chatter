import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const uploadRouter = createRouter()
    .mutation("icon", {
        input: z.object({
            userId: z.string().cuid(),
            path: z.string()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "input error",
                    message:" Invalid input"
                });
            }
            await ctx.prisma.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    icon: input.path
                }
            });
            return;
        }
    });