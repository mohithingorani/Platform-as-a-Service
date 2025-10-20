import express from "express"
import { S3 } from "aws-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: process.env.endpoint,
});

const app = express();

app.get("*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path === "/" ? "/index.html" : req.path;
  const key = `dist/${id}${filePath}`;

  console.log("key=", key);

  try {
    const contents = await s3.getObject({
      Bucket: "paas",
      Key: key,
    }).promise();

    const type = filePath.endsWith("html")
      ? "text/html"
      : filePath.endsWith("css")
      ? "text/css"
      : "application/javascript";

    res.set("Content-Type", type);
    res.send(contents.Body);

  } catch (err: any) {
    if (err.code === 'NoSuchKey') {
      res.status(404).send("File not found");
    } else {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});