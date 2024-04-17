import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

const posts = [
  { username: "Kyle", title: "Post 1" },
  { username: "Mango", title: "Post 2" },
];

// Get posts
// authentication middleware
app.get("/posts", authenticateToken, (req, res) => {
  // we only return the posts that match the username of the user
  res.json(posts.filter((post) => post.username === req.user.name));
});

// Middleware to authenticate token - we get token from the header and verify it
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  // we make sure that the token is present and it starts with Bearer and rest of the token with space in between -> Bearer TOKEN
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401).json({ message: "No token" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

app.listen(3000);
