export const signinProxie = async(): Promise<Response> => {
    const request = await fetch("/api/auth/user", {
        method: "POST"
    });

    return request
}