import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import generate from "./utils/randomStringGenerator";
import path from "path";
import getAllFiles from "./utils/getAllFiles";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const app = express();

const publisher = createClient({ url: `${process.env.REDIS_URL}` as string });
publisher.connect();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl;
    const id = generate(5);
    console.log("__dirname=", __dirname);
    // This is will store in the dist folder. we are using absolute paths
    const repoDir = path.join(__dirname, `output/${id}`);
    await simpleGit().clone(repoUrl, repoDir, ["--depth", "1"]);

    // Capture the exact source state we built from.
    try {
      const repo = simpleGit(repoDir);
      const branchSummary = await repo.branchLocal();
      const branch = branchSummary.current;
      const commitSha = (await repo.revparse(["HEAD"]))?.trim();
      if (branch) await publisher.hSet("branch", id, branch);
      if (commitSha) await publisher.hSet("commitSha", id, commitSha);
    } catch (err) {
      // Non-fatal: deployments still work without git metadata.
      console.warn("Failed to capture git metadata", err);
    }
    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    await Promise.all(
      files.map(async (file) => {
        let key = path.relative(__dirname, file);
        key = key.split(path.sep).join("/"); // Normalize path
        await uploadFile(key, file);
      })
    );

    await publisher.lPush("build-queue", id);
    await publisher.hSet("status", id, "uploaded");
    await publisher.hSet("repoUrl", id, repoUrl);
    await publisher.zAdd("deployments", { score: Date.now(), value: id });
    // await publisher.hget("status",id);
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

app.get("/status", async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await publisher.hGet("status", id);
    res
      .json({
        status: response,
      })
      .status(200);
  } catch (err) {
    res.json({
      error: err,
    }).status(500);
  }
});

app.get("/deployments", async (req, res) => {
  try {
    // Use zset scores as the canonical creation timestamp.
    // Node-redis exposes `zRangeWithScores`; keep a tiny fallback for older clients.
    const zRangeWithScores = (publisher as any).zRangeWithScores?.bind(publisher);
    const items: Array<{ value: string; score: number | string }> = zRangeWithScores
      ? await zRangeWithScores("deployments", 0, -1, { REV: true })
      : (await publisher.zRange("deployments", 0, -1, { REV: true })).map((value) => ({
          value,
          score: Date.now(),
        }));

    const deployments = await Promise.all(
      items.map(async ({ value: id, score }) => {
        const rawStatus = (await publisher.hGet("status", id)) || "unknown";
        const repoUrl = (await publisher.hGet("repoUrl", id)) || "";

        const createdAt = new Date(Number(score)).toISOString();

        // Optional metadata written by deploy-service.
        const buildStartedAt = await publisher.hGet("buildStartedAt", id);
        const deployedAt = await publisher.hGet("deployedAt", id);
        const failedAt = await publisher.hGet("failedAt", id);
        const failureReason = await publisher.hGet("failureReason", id);
        const branch = await publisher.hGet("branch", id);
        const commitSha = await publisher.hGet("commitSha", id);

        // Normalize status for frontend consumers.
        let status: "deployed" | "failed" | "building" | "pending" = "pending";
        if (rawStatus === "deployed") status = "deployed";
        else if (rawStatus === "uploaded" || rawStatus === "building") status = "building";
        else if (rawStatus.startsWith("failed")) status = "failed";
        else if (rawStatus === "unknown") status = "pending";

        const url = status === "deployed" ? `http://${id}.deploy.mohit-hingorani.tech` : undefined;

        const startedAtMs = buildStartedAt ? Number(buildStartedAt) : undefined;
        const completedAtMs = deployedAt ? Number(deployedAt) : failedAt ? Number(failedAt) : undefined;
        const durationMs =
          startedAtMs && completedAtMs && Number.isFinite(startedAtMs) && Number.isFinite(completedAtMs)
            ? Math.max(0, completedAtMs - startedAtMs)
            : undefined;

        return {
          id,
          repoUrl,
          status,
          createdAt,
          url,
          branch: branch || undefined,
          commitSha: commitSha || undefined,
          startedAt: startedAtMs ? new Date(startedAtMs).toISOString() : undefined,
          completedAt: completedAtMs ? new Date(completedAtMs).toISOString() : undefined,
          durationMs,
          failureReason: failureReason || undefined,
          rawStatus,
        };
      })
    );

    res.status(200).json(deployments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});


const PORT =process.env.UPLOAD_PORT || 3000

app.listen(PORT, () => {
  console.log(`Upload Service started at port ${PORT}`);
});
