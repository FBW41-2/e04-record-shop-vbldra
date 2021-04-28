/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const mongoose = require("mongoose");
const getId = require('./middleware/getId')
require('dotenv').config()

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
const dBURL = process.env.DB_URL
const dBPassword = process.env.DB_PASS
const dBUser = process.env.DB_USER

/**CONNECT TO DB */
mongoose.connect(`mongodb+srv://${dBUser}:${dBPassword}@${dBURL}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function() {
  console.log("Database connection established...");
});

/** SETTING UP LOWDB */
const adapter = new FileSync("data/db.json");
const db = low(adapter);
db.defaults({
  records: [],
  users: [],
  orders: []
}).write();

/** REQUEST PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setCors);
app.use(getId)

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
