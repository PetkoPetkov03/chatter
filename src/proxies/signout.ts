export const signoutProxie = async(): Promise<void> => {
    await fetch("/api/auth/logout");
}