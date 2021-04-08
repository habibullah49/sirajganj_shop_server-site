const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 9000;
app.use(cors());   
app.use(bodyParser.json())  


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev8gs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err',err);
  const productsCollection = client.db("sirajganjShop").collection("items");
  console.log('database connnected succesfully');
  const orderCollection = client.db("sirajganjShop").collection("order");

  app.post('/addProduct', (req, res) => {    
    const products = req.body
    console.log(products);
    productsCollection.insertOne(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })




  
  app.get('/booking', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        console.log(items)
        res.send(items)
      })

  })

  app.get('/product/:id', (req, res) => {
    productsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })


  app.post('/addCheckOut', (req, res) => {    
    const product = req.body
    console.log(product);
    orderCollection.insertOne(product)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orderCollection', (req, res) => {
    console.log(req.query.email);
    orderCollection.find({ email: req.query.email })
      .toArray((err, items) => {
        console.log(items)
        res.send(items)
      })

  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    productsCollection.deleteOne({
      _id: ObjectId(req.params.id)
      
    })
      .then((result) => {
        console.log(result);
        res.send(result.deletedCount > 0)
      })
  })





})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)



  





