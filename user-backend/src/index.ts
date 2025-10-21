import express from "express";
import dotenv from "dotenv"
dotenv.config();
const app = express();
app.use(express.json());
import userRoutes from "./routes/userRoutes"
import { PrismaClient } from "@prisma/client";
export const client =new  PrismaClient();


app.use("/users",userRoutes);



const PORT = process.env.PORT || 3019   
app.listen(PORT,()=>{
    console.log("APP STARTED AT PORT",PORT);
})