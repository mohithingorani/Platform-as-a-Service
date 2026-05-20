import fs from "fs";
import path from "path";



    //We'll have to use a recursive method
    //to add paths of all files inside an array
    //because in the root directory, there exists
    //both files and folders.

export default function getAllFiles(folderPath: string) {
  let response: string[] = [];

  const ignoreDirs = new Set([".git", "node_modules", ".next", "dist", "build"]);

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    if (ignoreDirs.has(file)) return;
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });

  return response;
}
