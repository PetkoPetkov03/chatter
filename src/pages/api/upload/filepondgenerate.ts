import { NextApiRequest, NextApiResponse } from "next";
import { readdir, writeFile, mkdir } from "fs";

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
        writeFile(`./public/images/${req.body.fileName}`, req.body.fileBase64String, "base64", (err) => {
            if(err){
                throw new Error("");
            }
        });
        res.json({
            path: `/public/images/${req.body.fileName}`
        });
    }
}