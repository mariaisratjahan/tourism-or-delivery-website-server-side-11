const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors = require('cors');
// cors
const app = express()
// dotenv
require('dotenv').config()
const port =process.env.PORT || 5000;
// middle ware
app.use(cors());
// express json
app.use(express.json());
// mongo uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.un416.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

// start------------------------------------
async function run() {
    try {
        await client.connect();
        const database = client.db("tour-database");
        const serviceCollection = database.collection("services");
        const placeOrderCollection = database.collection("booked");
        // create a document to insert
        // POST ------------(ADDING SERVICES)
        app.post('/addNewServices',async(req,res)=>{
          const data=req.body;
          console.log(data);
          const result = await serviceCollection.insertOne(data);
          res.send(result)
          console.log(result);
        })
      //  GET------------------getting services
      app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find({});
        const result=await cursor.toArray();
        res.send(result);
      })
      // get --------------------specific details
      app.get('/singleService/:id',async(req,res)=>{
        const id=req.params.id;
        const query = {_id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service)
      })
      // POST--------after booking
      app.post('/bookingService',async(req,res)=>{
        const data=req.body;
        console.log(data);
        const result = await placeOrderCollection.insertOne(data);
        res.send(result)

      })
      // get-----------orders through email
      app.get('/orders/:email',async(req,res)=>{
        const email=req.params.email;
        // console.log(email);
        const service = await placeOrderCollection.find({email: req.params.email});
        const result=await service.toArray();
        res.send(result);
      })
      // delete--------------delete order
      app.delete('/orderDelete/:id',async(req,res)=>{
          const id=req.params.id;
          const result = await placeOrderCollection.deleteOne({_id: ObjectId(id) });
          res.send(result)
      })
      // get -----------all orders
      app.get('/allOrders',async(req,res)=>{
        const cursor = placeOrderCollection.find({});
        const result=await cursor.toArray();
        res.send(result);
      })
      // put ------------update status
      
    } finally {
      
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('project')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})