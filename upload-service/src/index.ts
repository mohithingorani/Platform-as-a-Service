import express from "express"
import cors from "cors"
import simpleGit from "simple-git"
import generate from "./utils/randomStringGenerator";
import path from "path"

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy",async(req,res)=>{
    try{
        const repoUrl = req.body.repoUrl;
        const id = generate(5);

        // This is will store in the dist folder. we are using absolute paths
        await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`));
        res.json({
            id
        }).status(200);

        
        // We cant upload a directory to s3 using aws-sdk so we'll create an array of all the files

    }catch(error){
        console.log(error);
        res.json({
            message:"Error deploying application"
        });
    }


})
app.listen(3000,()=>{
    console.log("Started at port 3000");
});
