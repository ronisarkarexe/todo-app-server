const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v4fkr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("jerins_parluor");
    const userCollection = database.collection("toUser");

    app.post("/create-user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.status(200).send(result);
    });

    app.get("/all-user", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.status(200).send(users);
    });

    app.patch("/update-user/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: body };
      const result = await userCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.status(200).json({ status: 'success', data: result});
    });

    app.delete("/delete-user/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(cursor);
      res.status(200).json({ status: 'success', data: result});
    });
  } finally {
  }
}
run().catch();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
