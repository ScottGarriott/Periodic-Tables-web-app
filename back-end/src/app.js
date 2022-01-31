const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router")

const app = express();
var corsOptions = {
    origin: 'https://git.heroku.com/periodic-tables-7447-front-end.git',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.use(cors(corsOptions));
app.use(express.json());

app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter)

app.use(notFound);
app.use(errorHandler);

module.exports = app;
