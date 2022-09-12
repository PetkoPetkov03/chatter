import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse, NextApiRequest } from "next";
import { sessionOptions } from "../../../libs/session";

export default withIronSessionApiRoute(
  function userRoute(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST"){ 
      throw new Error("Wrong Request Method!");
    }
    
    res.json({ user: req.session.user });
  },
  sessionOptions
);