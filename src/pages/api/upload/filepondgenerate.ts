import { NextApiRequest, NextApiResponse } from "next";
import { readdir, writeFile, mkdir } from "fs";
import { TRPCError } from "@trpc/server";

export default function filepondstorageRoute(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        readdir("./public/images", async(err, result) => {
            if(typeof result === "undefined") {
                mkdir("./public/images", (err) => {
                    if(err) {
                        return;
                    }
                });
            }
            
        });

        const randString = Math.random().toString(36).slice(2, 7);

        const fileName = randString + req.body.fileName as string;
        const filePath: string = `public/images/${fileName}` as string;
        if(filePath.match(/\.\.\//g) !== null) {
            throw new TRPCError({
                code: "FORBIDDEN",
                cause: "Unauthorized use",
                message: "Attempted path traversal"
            });
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
  