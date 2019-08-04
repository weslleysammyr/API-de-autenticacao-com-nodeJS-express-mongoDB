require("dotenv").config();

const express = require("express");

const mongoose = require("./middlewares/mongo/mongoose");
const routes = require("./routes");

const app = express();

/**
 * Disable powered by express
 */
app.disable("x-powered-by");

/**
 * Start MongoDB connection
 */
mongoose.connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//associando os arquivos de rota na aplicação
routes.install(app);

app.listen(process.env.PORT);

module.exports = app;
