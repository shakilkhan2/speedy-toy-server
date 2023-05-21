const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const allToys = client.db("toysData").collection("allToys");
    const addedToys = client.db("toysData").collection("addedToys");

    app.get("/toys", async (req, res) => {
      const cursor = allToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // addedToys
    app.get("/addedToys", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      if (req.query.search) {
        query = {
          ...query,
          productName: { $regex: req.query.search, $options: "i" },
        };
      }
      const cursor = addedToys
        .find(query)
        .limit(parseFloat(req.query.limit || 20))
        .sort({
          price: req.query.sort === "acc" ? 1 : -1,
        });
      const result = await cursor.toArray();
      return res.send(result);
    });

    //
    app.get("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projections: {
          productName: 1,
          photo: 1,
          seller: 1,
          sellerEmail: 1,
          category: 1,
          price: 1,
          rating: 1,
          quantity: 1,
          description: 1,
        },
      };
      const result = await addedToys.findOne(query, options);
      res.send(result);
    });
    // add
    app.post("/addedToys", async (req, res) => {
      const addedToy = req.body;
      console.log(addedToy);
      const result = await addedToys.insertOne(addedToy);
      res.send(result);
    });

    // update
    app.patch("/update-toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedData = { ...req.body };
      const result = await addedToys.updateOne(query, {
        $set: updatedData,
      });
      res.send(result);
    });

    // delete
    app.delete("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedToys.deleteOne(query);
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

app.get("/", (req, res) => {
  res.send("Speedy Toy is running...");
});

app.listen(port, () => {
  console.log(`Speedy Toy is running on port: ${port}`);
});
