import express from "express";
import { S3 } from "aws-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: process.env.endpoint,
});

const app = express();

function contentTypeForPath(filePath: string) {
  const p = filePath.toLowerCase();
  if (p.endsWith(".html")) return "text/html; charset=utf-8";
  if (p.endsWith(".css")) return "text/css; charset=utf-8";
  if (p.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (p.endsWith(".mjs")) return "application/javascript; charset=utf-8";
  if (p.endsWith(".json")) return "application/json; charset=utf-8";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".gif")) return "image/gif";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".ico")) return "image/x-icon";
  if (p.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (p.endsWith(".woff")) return "font/woff";
  if (p.endsWith(".woff2")) return "font/woff2";
  if (p.endsWith(".ttf")) return "font/ttf";
  if (p.endsWith(".wasm")) return "application/wasm";
  return "application/octet-stream";
}

function isImmutableAsset(filePath: string) {
  // Heuristic for bundler-hashed assets.
  // Vite commonly uses `index-<hash>.js` (dash) and hashes are not necessarily hex-only.
  return /[.-][a-z0-9]{8,}\./i.test(filePath);
}

app.get("*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path === "/" ? "/index.html" : req.path;
  const key = `dist/${id}${filePath}`;

  try {
    const contents = await s3.getObject({
      Bucket: "paas",
      Key: key,
    }).promise();

    res.set("Content-Type", contentTypeForPath(filePath));
    res.set(
      "Cache-Control",
      isImmutableAsset(filePath)
        ? "public, max-age=31536000, immutable"
        : filePath === "/index.html"
        ? "no-cache"
        : "public, max-age=300"
    );
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
