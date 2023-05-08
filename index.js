const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middelware
app.use(cors());
app.use(express.json());

// Create DB: ashrafulhaque xH4t0U3SN2tm50Dy

app.get('/', (req, res) => {
  res.send('CURD SERVER is Running...')
});

// connect to Mongo DB
const uri = "mongodb+srv://ashrafulhaque:xH4t0U3SN2tm50Dy@cluster0.vgnfmcl.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
const run = async () => {
  try {
    await client.connect();

    // const database = client.db(('usersDB')) // db
    // const userCollection = database.collection('users') //db
    const userCollection = client.db('usersDB').collection('users') // db

    // [C - CREATE] receive data from client 
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('New User:', user);
      const result = await userCollection.insertOne(user); //db
      res.send(result);
    })

    // [R - READ] get data from mongoDB
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    // [U - UPDATE] with receive request specific id params from client
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Update user from DB:', id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    // [U - UPDATE] data receive from client
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      console.log('Update user from DB [PUT]:', id, updatedUser);
      res.send(updatedUser);
    })

    // [D - DELETE] delete request from client
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Delete user from DB:', id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`CRUD SERVER is Running on Port: ${port}`)
})