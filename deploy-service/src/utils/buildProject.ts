import { exec, spawn } from "child_process";
import path, { resolve } from "path";
import { publisher } from "..";

export function buildProject(id: string) {
    return new Promise((resolve) => {
        console.log("Path = ",path.join(__dirname, `output/${id}`));
        const child = exec(`cd ${path.join(__dirname,'../', `output/${id}`)} && npm install && npm run build`)

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function(code) {
           resolve("")
        });

    })
}

async function publishToRedis(id : string,log:string){
    await publisher.publish(`logs:${id}`,log);
}


export function buildProject2(id:string){
    const dir = path.join(__dirname,`../`,`output/${id}`);
    return new Promise((resolve)=>{
        const install = spawn("npm",["install"],{cwd:dir});
        install.stdout.on("data",(data)=>{
            const log = "[INSTALL] "+data.toString();
            console.log(log);
            publishToRedis(id,log);
        });
        install.stderr.on("data",(data)=>{
            const log = "[INSTALL] "+data.toString();
            console.log(log);
            publisher.publish(`logs:${id}`,log);

        });

        install.on("close",(code)=>{
            const log = `[INSTALL] exited with code ${code}`;
            console.log(log);
            publisher.publish(`logs:${id}`,log);
            const build = spawn("npm",["run","build"],{cwd:dir});
            build.stdout.on("data",(data)=>{
                const log = "[BUILD] " + data.toString();
                publishToRedis(id,log);
            })
            build.stderr.on("data",(data)=>{
                const log = "[BUILD] " + data.toString();
                console.log(log);
                publishToRedis(id,log);
            })

            build.on("close",(code)=>{
                const log = "[BUILD] exited with code " + code;
                console.log(log);
                publishToRedis(id,log);
                resolve("");
            });
        });
    });
}