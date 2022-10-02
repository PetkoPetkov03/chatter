import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import * as z from "zod";

export const adminActions = createRouter()
    .mutation("givePriviliges", {
        input: z.object({
            id: z.string().cuid({ message: "invalid id" }).nullish(),
            currentPrivilages: z.boolean().nullish()
        }).nullish(),

        async resolve({ input, ctx }) {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing input"
                });
            }
            
            console.log(input.id, input.currentPrivilages);
            
            if (typeof input.id !== "string" || typeof input.currentPrivilages !== "boolean") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing directives"
                });
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
        async resolve({ input, ctx }) {
            if (typeof input?.password === "undefined") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    cause: "User",
                    message: "Missing input"
                });
            }

            const adminPassword = process.env.ADMIN_PASS as string;

            console.log(adminPassword, input.password);


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
        async resolve({ ctx }) { 
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