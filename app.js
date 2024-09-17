const express = require("express");
//require("/root/EasyCal/instrument.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("/root/EasyCal/utils/config");
const logger = require("/root/EasyCal/utils/logger");
//const Sentry = require("@sentry/node");
const cors = require("cors");
const middleware = require("/root/EasyCal/utils/middleware");
const app = express();
const session = require("express-session");
const passport = require("passport");
const userRoutes = require("/root/EasyCal/routers/userRouter");
const debtRoutes = require("/root/EasyCal/routers/debtRouter");
const calcRoutes = require("/root/EasyCal/routers/calculatorRouter");
//const redisClient = require("/root/EasyCal/utils/reddisConnection.js");
//require("/root/EasyCal/utils/passport");

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
