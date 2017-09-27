"use strict";

const express = require("express");
const app = express();
const logs = require("./logs");

app.use(express.static(__dirname + "/../../client"));

app.get("/api/connections", (req, res) => {
  res.json(logs.connections());
});

app.get("/api/events", (req, res) => {
  res.json(logs.events());
});

app.listen(8080);
