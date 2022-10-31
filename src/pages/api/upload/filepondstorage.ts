import { NextApiRequest, NextApiResponse } from "next";

export default function filepondstorageRoute(req: NextApiRequest, res: NextApiResponse) {
  res.send(200);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}
