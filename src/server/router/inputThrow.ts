import { TRPCError } from "@trpc/server";

export function ThrowTRPCInputErrorHook() {
    return new TRPCError({
        code: "BAD_REQUEST",
        cause: "Input",
        message: "Invalid input type"
    });
}

export function ThrowTRPCAuthErrorHook() {
    return new TRPCError({
        code: "FORBIDDEN",
        cause: "Unathorized user!",
        message: "You dont have access to this page!"
    });
}

export function ThrowTRPCInternalErrorHook() {
    return new TRPCError({
        code: "INTERNAL_SERVER_ERROR"
    });
}