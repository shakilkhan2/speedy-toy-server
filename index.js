const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rawumbi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const truckToys = client.db("Toys").collection("truck");
    app.get("/trucks", async (req, res) => {
      const cursor = truckToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    const trainToys = client.db("toysTwo").collection("trains");
    app.get("/trains", async (req, res) => {
      const cursor = trainToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    const carToys = client.db("toysThree").collection("cars");
    app.get("/cars", async (req, res) => {
      const cursor = carToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    const allToys = client.db("toysData").collection("allToys");
    app.get("/toys", async (req, res) => {
      const cursor = allToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// API data:
const formulaOne = require("./data/formulaOne.json");
const train = require("./data/train.json");
const truck = require("./data/car.json");

app.get("/", (req, res) => {
  res.send("Speedy Toy is running...");
});

// app.get("/formula-one", (req, res) => {
//   res.send(formulaOne);
// });
// app.get("/train", (req, res) => {
//   res.send(train);
// });
// app.get("/truck", (req, res) => {
//   res.send(truck);
// });

app.listen(port, () => {
  console.log(`Speedy Toy is running on port: ${port}`);
});
