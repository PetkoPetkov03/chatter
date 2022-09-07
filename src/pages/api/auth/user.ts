import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse, NextApiRequest } from "next";

export default withIronSessionApiRoute(
  function userRoute(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST"){ 
      
    }
    
    res.json({ user: req.session.user });
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