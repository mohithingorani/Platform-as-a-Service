import { exec, spawn } from "child_process";
import path, { resolve } from "path";

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


export function buildProject2(id:string){
    const dir = path.join(__dirname,`../`,`output/${id}`);
    return new Promise((resolve)=>{
        const install = spawn("npm",["install"],{cwd:dir});
        install.stdout.on("data",(data)=>{
            console.log("[INSTALL] ",data.toString());
        });
        install.stderr.on("data",(data)=>{
            console.log("[INSTALL] ",data.toString());
        });

        install.on("close",(code)=>{
            console.log(`[INSTALL] exited with code ${code}`);

            const build = spawn("npm",["run","build"],{cwd:dir});
            build.stdout.on("data",(data)=>{
                console.log("[BUILD] " + data.toString());
            })
            build.stderr.on("data",(data)=>{
                console.log("[BUILD]" + data.toString());
            })

            build.on("close",(code)=>{
                console.log("[BUILD] exited with code " + code);
                resolve("");
            });
        });
    });
}