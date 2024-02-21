const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;
const connectDB = require("./db/connectDB");
const User = require("./models/User");

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(cookieParser());

// Authentication Middleware
// token verifying
const verifyToken = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }
};

// Routes
// logging in user
app.post("/jwt", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10h",
      }
    );
    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// logging out
app.post("/logout", verifyToken, async (req, res) => {
  try {
    // Do any cleanup or additional logout logic here
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// verifying user
app.get("/verifyAuth", verifyToken, async (req, res) => {
  try {
    // If the request reaches here, it means the token is valid
    const userEmail = req.user.email;
    const query = { email: userEmail };
    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.json({
        email: existingUser.email,
        name: existingUser.name,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// user related apis
// normal route
// registering user
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.send({ message: "User already exists", insertedId: null });
    }

    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Replace the plain text password with the hashed password
    user.password = hashedPassword;
    user.role = "user";

    // Create the user in the database
    const result = await User.create(user);

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/", async (req, res) => {
  res.send("Welcome to Faucets server");
});

// Connect to database and start the server
const main = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Faucets Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

main();
