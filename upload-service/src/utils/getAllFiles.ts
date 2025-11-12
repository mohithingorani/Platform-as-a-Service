import fs from "fs"
import path from "path"



    //We'll have to use a recursive method
    //to add paths of all files inside an array
    //because in the root directory, there exists
    //both files and folders.

export default function getAllFiles(folderPath:string){
    let response:string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath = path.join(folderPath,file);
        if(fs.statSync(fullFilePath).isDirectory()){
            // Push files directly instead of concat to avoid creating new arrays
            response.push(...getAllFiles(fullFilePath));
        }
        else{
            response.push(fullFilePath);
        }
        
    })
    console.log(response);
    return response;
}   