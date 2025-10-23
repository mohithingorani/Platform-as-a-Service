import express from "express";
import { client } from "..";
const router = express.Router();

router.get("/", async (req, res) => {
  const username = req.query.username as string;
  console.log("Username: ",username);
  try {
    const user = await client.user.findFirst({
      where: {
        username,
      },
    });
    if (user) {
      console.log("Fetched user with email", username);
      res.json({
        user,
      });
    } else {
      res.json({
        message: "User does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      err,
    });
  }
});

router.post("/", async (req, res) => {
  const username = req.body.username;

  // check if user already exists
  try {
    const user = await client.user.findFirst({
      where: {
        username,
      },
    });
    if (user) {
      console.log("User already exists");
      res
        .json({
          user,
          message: "User exists",
        })
        .status(200);
    }
    else{
        const {username,name,profilePicture}:{
            username:string,
            name:string,
            profilePicture:string 
        } = req.body
        const user = await client.user.create({
            data:{
                username,
                profilePicture,
                name
            }
        })
        console.log("User Created");
        res.json({
            user,
            message:"User Created"
        })
    }
  }
  

   catch (err) {
    console.error(err);
    res
      .json({
        err,
      })
      .status(200);
  }
})
  
  

export default router;
