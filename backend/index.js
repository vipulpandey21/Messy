const cluster = require("cluster");
const os = require("os");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const newUser = require("./models/signup");
const verifyToken = require("../backend/middleware/verifyToken");
const HR_route = require("./my-routes/HR_route");
const menus = require("./my-routes/menus");
const announce_route = require("./my-routes/announce_route");
const complaints_route = require("./my-routes/complaint_route");
const email_route=require('./my-routes/email');
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;
const sessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
};

// JWT Secret Keys (should ideally be in environment variables)
const accessTokenSecret = process.env.SECRET_KEY;
const refreshTokenSecret = process.env.SECRET_KEY;
let refreshTokens = [];

// Check if the current process is the master process
if (cluster.isMaster) {
  // Get the number of CPU cores
  const numCPUs = os.cpus().length;

  console.log(`Master process is running. Forking for ${numCPUs} CPUs...`);

  // Fork worker processes equal to the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker process exit events
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork(); // Fork a new worker process
  });
} else {
  // Worker process: Create an Express app
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(session(sessionOptions));
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.message = req.flash();
    next();
  });

  // Routes
  app.use("/api/v1", HR_route);
  app.use("/api/v1", complaints_route);
  app.use("/api/v1", menus);
  app.use("/api/v1", announce_route);
  app.use("/api/v1", email_route);
  
  // Health Check Route
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Server is healthy",
      worker: process.pid,
    });
  });

  // Database Connection
  mongoose
    .connect("mongodb://localhost:27017/messh", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

  // JWT Token Generation
  const generateAccessToken = (user) => {
    return jwt.sign(
      {
        isSuperAdmin: user.isSuperAdmin,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        hostelname: user.hostel_name,
        ObjectID: user._id,
      },
      accessTokenSecret,
      {
        expiresIn: "15m",
      }
    );
  };

  const generateRefreshToken = (user) => {
    return jwt.sign(
      {
        isSuperAdmin: user.isSuperAdmin,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        hostelname: user.hostel_name,
        ObjectID: user._id,
      },
      refreshTokenSecret
    );
  };

  // Login Route
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await newUser.findAndValidate(email, password);
    if (!email || !password) {
      return res.status(400).json("Please provide email and password");
    }
    if (!foundUser) {
      console.log("Error");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);
    refreshTokens.push(refreshToken);
    res.json({
      success: true,
      message: "Logged in successfully",
      foundUser: {
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
        isSuperAdmin: foundUser.isSuperAdmin,
        name: foundUser.name,
        ObjectID: foundUser._id,
      },
      token: accessToken,
      refreshToken,
    });
  });

  // Register Route
  app.post("/register", async (req, res) => {
    const { name, hostel_name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const existingUser = await newUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const user = new newUser({ name, hostel_name, email, password });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        email: user.email,
        name: user.name,
      },
      token: accessToken,
      refreshToken,
    });
  });

  // Logout Route
  app.post("/logout", verifyToken, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    req.session.user_id = null;
    res.json({ message: "Logged out successfully" });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Worker ${process.pid} started and listening on port ${port}`);
  });
}