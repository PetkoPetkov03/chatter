import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse, NextApiRequest } from "next";
import { trpc } from "../../../utils/trpc";

export default withIronSessionApiRoute(
    async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

        if (req.method !== "POST") {
            throw new Error("POST request only!");
        }


        type UserBody = {
            email: string,
            id: string,
            username: string,
            admin: boolean
        }

        const bodyUnparsed = await req.body;

        const body: UserBody = await JSON.parse(bodyUnparsed);


        // @ts-expect-error
        req.session.user = {
            email: body.email,
            username: body.username,
            id: body.id,
            admin: body.admin
        };
        

        console.log(await req.session.save());
        res.status(200).send({ok: true});

    },
    {
        cookieName: process.env.APP_COOKIE_NAME as string,
        password: process.env.SECRET_COOKIE_PASSWORD as string,
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    },
);