import { S3 } from "aws-sdk";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: process.env.endpoint,
});

async function downloadFromS3(prefix: string) {
  console.log(`🔍 Starting download for prefix: "${prefix}"`);

  const allFiles = await s3
    .listObjectsV2({
      Bucket: "paas",
      Prefix: prefix,
    })
    .promise();

  const contents = allFiles.Contents ?? [];
  console.log(`📦 Found ${contents.length} files in bucket "paas" with prefix "${prefix}"`);

  const allPromises = contents.map(({ Key }, index) => {
    if (!Key) {
      console.warn(`Skipping undefined key at index ${index}`);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const finalOutputPath = path.join(__dirname, Key);
      const outputDir = path.dirname(finalOutputPath);

      try {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
          console.log(`📁 Created directory: ${outputDir}`);
        }
      } catch (err) {
        console.error(`Failed to create directory ${outputDir}:`, err);
        return reject(err);
      }

      console.log(`⬇️  Downloading: ${Key} → ${finalOutputPath}`);

      const outputFile = fs.createWriteStream(finalOutputPath);

      s3.getObject({ Bucket: "paas", Key })
        .createReadStream()
        .on("error", (err) => {
          console.error(`Failed to download ${Key}:`, err);
          reject(err);
        })
        .pipe(outputFile)
        .on("finish", () => {
          console.log(`Downloaded: ${Key}`);
          resolve();
        })
        .on("error", (err) => {
          console.error(`File stream error for ${Key}:`, err);
          reject(err);
        });
    });
  });

  try {
    await Promise.all(allPromises);
    console.log("🎉 All files downloaded successfully!");
  } catch (err) {
    console.error("🚨 One or more downloads failed.", err);
  }
}

export { downloadFromS3 };
