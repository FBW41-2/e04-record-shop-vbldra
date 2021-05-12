/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();


/** ROUTERS */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const recordsRouter = require("./routes/records");
const ordersRouter = require("./routes/orders");
const { setCors } = require("./middleware/security");

/** INIT */
const app = express();

/** LOGGING */
app.use(logger("dev"));

/** ENV VARIABLES **/
const dbURL = process.env.DB_URL;
const dbPassword = process.env.DB_PASS;
const dbUser = process.env.DB_USER;

/**CONNECT TO DB */
const localDbURI = "mongodb://localhost:27017/record-shop"
const atlasURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbURL}`
mongoose.connect(
    process.env.DB_URL ? atlasURI : localDbURI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }
);

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function () {
    console.log("Database connection established...");
});

/** REQUEST PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setCors);

/** STATIC FILES*/
app.use(express.static(path.join(__dirname, "public")));

/** ROUTES */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/records", recordsRouter);
app.use("/orders", ordersRouter);

/** ERROR HANDLING */
app.use(function(req, res, next) {
  const error = new Error("Looks like something broke...");
  error.status = 400;
  next(error);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    error: {
      message: err.message
    }
  });
});

/** EXPORT PATH */
module.exports = app;
