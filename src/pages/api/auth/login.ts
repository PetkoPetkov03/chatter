import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse, NextApiRequest } from "next";
import { sessionOptions } from "../../../libs/session";

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
        
        req.session.user = {
            email: body.email,
            username: body.username,
            id: body.id,
            admin: body.admin
        };
        

        await req.session.save()
        res.status(200).send({ok: true});

    },
    sessionOptions
);