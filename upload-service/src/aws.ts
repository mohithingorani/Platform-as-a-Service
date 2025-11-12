import fs from "fs"
import * as dotenv from "dotenv";
dotenv.config();

// fileName = output/12412/src/App.jsx
// filePath = /Users/mohit/upload-service/dist/output/12412/src/App.jsx

import {S3} from "aws-sdk"

const s3 = new S3({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    endpoint:process.env.endpoint
})

export const uploadFile = async (fileName:string,localFilePath:string)=>{
    const fileStream = fs.createReadStream(localFilePath);
    const response = await s3.upload({
        Body:fileStream,
        Bucket:"paas",
        Key:fileName.replace(/\\/g, "/")
    }).promise();
    console.log(response);
}