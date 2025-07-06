import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import generate from "./utils/randomStringGenerator";
import path from "path";
import getAllFiles from "./utils/getAllFiles";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const app = express();

const publisher = createClient();
publisher.connect();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl;
    const id = generate(5);

    // This is will store in the dist folder. we are using absolute paths
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    await Promise.all(
      files.map(async (file) => {
        let key = path.relative(__dirname, file);
        key = key.split(path.sep).join("/"); // Normalize path
        await uploadFile(key, file);
      })
    );

    await publisher.lPush("build-queue", id);

    res
      .json({
        id,
      })
      .status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deploying application",
    });
  }
});
app.listen(3000, () => {
  console.log("Started at port 3000");
});
