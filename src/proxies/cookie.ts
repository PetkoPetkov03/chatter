import type { User } from "./../types/UserTypes"

export const createCookieProxie = async ( body: User ): Promise<Response> => {

    if (!body) {
        throw new Error("Body missing from request: cookie creation!");
    }

    const request = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body)
    });

    return request;
}