const express = require("express");
var cors = require("cors");
const app = express();

// middleware
app.use(cors());

const port = process.env.PORT || 5000;

const formulaOne = require("./data/formulaOne.json");
const train = require("./data/train.json");
const truck = require("./data/car.json");

app.get("/", (req, res) => {
  res.send("Speedy Toy is running...");
});

app.get("/formula-one", (req, res) => {
  res.send(formulaOne);
});
app.get("/train", (req, res) => {
  res.send(train);
});
app.get("/truck", (req, res) => {
  res.send(truck);
});

app.listen(port, () => {
  console.log(`Speedy Toy is running on port: ${port}`);
});
