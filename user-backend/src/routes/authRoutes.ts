import express from "express";
import { client } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    const existingUser = await client.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const username = email.split("@")[0] + "_" + Date.now().toString(36);

    const user = await client.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        profilePicture: null,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.profilePicture,
      },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await client.user.findFirst({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.profilePicture,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.post("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    const user = await client.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;