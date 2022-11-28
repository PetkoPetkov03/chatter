
import { createRouter } from "./context";
import * as z from "zod";
import { ThrowTRPCInputErrorHook } from "./inputThrow";

export const adminActions = createRouter()
    .mutation("givePriviliges", {
        input: z.object({
            id: z.string().cuid({ message: "invalid id" }),
            currentPrivilages: z.boolean()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw ThrowTRPCInputErrorHook();
            }

            if (input.currentPrivilages === true) {
                return {
                    message: "User already has escalated privilages!"
                }
            }

            await ctx.prisma.user.update({
                where: {
                    id: input.id
                },

                data: {
                    admin: true
                }
            });

            return {
                message: "Privilages given"
            }
        }
    })
    .mutation("access", {
        input: z.object({
            password: z.string().nullish()
        }).nullish(),
        async resolve({ input }) {
            if (typeof input?.password === "undefined") {
                throw ThrowTRPCInputErrorHook();
            }

            const adminPassword = process.env.ADMIN_PASS as string;


            if (input.password !== adminPassword) {
                return {
                    access: false,
                    message: "Access Denied passwords don't match!"
                }
            }

            return {
                access: true,
                message: "Access granted"
            }
        }
    })
    .query("fetchReports", {
        input: z.object({
            user_STATUS: z.boolean()
        }).nullish(),
        async resolve({ ctx, input }) {
            if (typeof input?.user_STATUS !== "boolean") {
                throw ThrowTRPCInputErrorHook();
            }
            

            const reports = await ctx.prisma.reports.findMany({
                orderBy: {
                    date: "desc"
                }
            });

            return {
                reports: reports
            }
        }
    });