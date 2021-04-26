/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { MongoClient } = require("mongodb");

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

/** Connect to MongoDB **/
async function connectDB() {
    const url =
        "mongodb+srv://dbUser:QoJf39y0EbXhK3mI@cluster0.ml2b8.mongodb.net/record-shop?retryWrites=true&w=majority";
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        console.log("Trying to connect...");
        await client.connect();
        console.log("Connected..");
        app.locals.db = client.db();
        await listDatabases(client);
    } catch (error) {
        console.error(error);
    }
}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

connectDB().catch(console.error);

/** SETTING UP LOWDB */
const adapter = new FileSync("data/db.json");
const db = low(adapter);
db.defaults({
    records: [],
    users: [],
    orders: [],
}).write();

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
app.use(function (req, res, next) {
    const error = new Error("Looks like something broke...");
    error.status = 400;
    next(error);
});

app.use(function (err, req, res, next) {
    res.send({
        error: {
            message: err.message,
        },
    });
});

/** EXPORT PATH */
module.exports = app;
