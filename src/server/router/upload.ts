
import { z } from "zod";
import { createRouter } from "./context";
import { ThrowTRPCInputErrorHook } from "./inputThrow";

export const uploadRouter = createRouter()
    .mutation("icon", {
        input: z.object({
            userId: z.string().cuid(),
            path: z.string()
        }).nullish(),

        async resolve({ input, ctx }) {
            if(!input) {
                throw ThrowTRPCInputErrorHook();
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