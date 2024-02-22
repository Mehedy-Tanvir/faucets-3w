const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const port = process.env.PORT || 3000;
const connectDB = require("./db/connectDB");
const User = require("./models/User");
const Request = require("./models/Request");

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

// oauth google sign in
app.post("/authRequest", async (req, res) => {
  // for dealing with cors
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://127.0.0.1:3000/oauth";
  // initializing oauth
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );
  // generating url to ping google
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    // in production it is only needed to force refresh token to be created
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

// getting OAuth user Data
async function getUserData(access_token) {
  // v3
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  // console.log("data", data);
  return data;
}

// oauth
app.get("/oauth", async (req, res) => {
  const code = req.query.code;
  // console.log(code);
  let authToken;
  let googleUser;
  try {
    const redirectUrl = "http://127.0.0.1:3000/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const res = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(res.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);
    const authenticatedUser = await getUserData(user.access_token);
    console.log(authenticatedUser);
    // creating jwt token for google signed in user
    authToken = jwt.sign(
      { email: authenticatedUser?.sub },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10h",
      }
    );

    // now storing authenticated user data in database
    try {
      const existingUser = await User.findOne({
        email: authenticatedUser?.sub,
      });
      googleUser = existingUser;
      if (!existingUser) {
        googleUser = await User.create({
          role: "user",
          name: authenticatedUser?.name,
          email: authenticatedUser?.sub,
        });
      }
      console.log("google user", googleUser);
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log("Error with signing with Google", err);
  }
  // making url with query
  const redirectURL = `http://localhost:5173/?success=true&token=${authToken}&name=${googleUser?.name}&role=${googleUser?.role}&email=${googleUser?.email}`;
  res.redirect(303, redirectURL);
});

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
        user: existingUser,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// getting all users admin route
app.get("/users", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findOne({ email: req?.user?.email });

    if (user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User is not an admin.",
      });
    }

    const users = await User.find();

    if (users) {
      return res.json({
        users,
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

// wallet request
app.post("/requests", async (req, res) => {
  try {
    const { walletAddress, sendingTime, amount } = req.body;
    const hashedWalletAddress = await bcrypt.hash(walletAddress, 10);
    const request = { walletAddress: hashedWalletAddress, sendingTime, amount };
    const result = await Request.create(request);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/requests", async (req, res) => {
  try {
    const result = await Request.find();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
