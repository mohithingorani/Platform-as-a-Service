import express from "express"
import { S3 } from "aws-sdk";
import * as dotenv from "dotenv";
import mime from "mime-types";
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

    // Use mime-types library for proper content type detection
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    res.set("Content-Type", contentType);
    // Add caching headers for static assets (1 hour)
    res.set("Cache-Control", "public, max-age=3600");
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