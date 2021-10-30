const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jc626.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("flash_xpress");
    // const productCollection = database.collection("products");
    const parcelCollection = database.collection("parcels");

    // Add Parcels API
    app.post("/createParcel", async (req, res) => {
      const parcel = req.body;
      const result = await parcelCollection.insertOne(parcel);
      res.json(result);
    });
    
    //GET Parcels API
    app.get("/parcels", async (req, res) => {
      const cursor = parcelCollection.find({});
      const parcels = await cursor.toArray();
      res.send(parcels);
    });

    // GET my Prcels
    app.get("/myParcels/:email", async (req, res) => {
      const result = await parcelCollection
        .find({
          sender_email: req.params.email,
        })
        .toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Flash xpress server is running");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});