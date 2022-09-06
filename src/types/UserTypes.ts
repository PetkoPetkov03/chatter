export type User = {
    id: string,
    email: string,
    username: string,
    admin: string
} | undefined


export type PropsUser = {
    user: {
        id: string,
        email: string,
        username: string,
        admin: string
    },
    children: React.PropsWithChildren

}