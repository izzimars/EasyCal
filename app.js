const express = require("express");
//require("/root/EasyCalinstrument.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("/root/EasyCalutils/config");
const logger = require("/root/EasyCalutils/logger");
//const Sentry = require("@sentry/node");
const cors = require("cors");
const middleware = require("/root/EasyCalutils/middleware");
const app = express();
const session = require("express-session");
const passport = require("passport");
const userRoutes = require("/root/EasyCalrouters/userRouter");
const debtRoutes = require("/root/EasyCalrouters/debtRouter");
const calcRoutes = require("/root/EasyCalrouters/calculatorRouter");
//const redisClient = require("/root/EasyCalutils/reddisConnection.js");
//require("/root/EasyCalutils/passport");

//DATABASES
mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI, {})
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// (async () => {
//   await redisClient.connect();
// })();
//middleware for requests before routes access
//Sentry.setupExpressErrorHandler(app);

//app config
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//google middleware
// app.use(
//   session({
//     secret: config.SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// Initialize Passport and use session
// app.use(passport.initialize());
// app.use(passport.session());

//app.use(middleware.requestLogger);
app.use(bodyParser.json());

// Use routes
//app.use("/auth", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/calcs/", calcRoutes);
app.use("/api/debts/", debtRoutes);

//middleware to handle errors in utils module
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
