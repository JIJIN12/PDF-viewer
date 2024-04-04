const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const formRouter = require("./src/router/fileformRouter");
const app = express();

app.use(cors());
app.use(express.json()); // Add this line for JSON parsing
app.use(express.urlencoded({ extended: true })); // Add this line for URL-encoded data parsing

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //  * every url can access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

require("dotenv").config();

app.use("/form", formRouter);

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/PDF_SERVER"; // Providing a default URL if not specified
const PORT = process.env.PORT || 2000;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, function () {
      console.log("Server started on http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.log('error',error);
  });
