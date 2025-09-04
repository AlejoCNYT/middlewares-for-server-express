const express = require("express");
const app = express();

const mediumClients = require("./medium-clients");
const premiumClients = require("./premium-clients");

app.use("/medium-clients", mediumClients);
app.use("/premium-clients", premiumClients);

app.get("/", function (req, res) {
  res.send("Bienvenido a la api de ADA Cars");
});

module.exports = app;
