import { NextApiRequest, NextApiResponse } from "next";
import { readdir, writeFile, mkdir } from "fs";
import { ThrowTRPCAuthErrorHook } from "../../../server/router/inputThrow";

export default function filepondstorageRoute(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const randString = (Math.random() + 1).toString(36).substring(2);
        const fileName = randString + req.body.fileName as string;
        const filePath: string = `public/images/${fileName}` as string;
        if(filePath.match(/\.\.\//g) !== null) {
            throw ThrowTRPCAuthErrorHook();
        }
        writeFile(filePath, req.body.fileBase64String, "base64", (err) => {
            if(err){
                throw new Error("");
            }
        });
        res.json({
            path: `/images/${fileName}`
        });
    }
}
export const config = {
    api: {
      bodyParser: {
        sizeLimit: '20mb',
      },
    },
  }