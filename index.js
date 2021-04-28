const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h4k9o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const bookCollection = client.db("bookdata").collection("books");
  const orderCollection = client.db("bookdata").collection("orders");
  



    app.get('/books', (req, res) => {
      bookCollection.find()
      .toArray((err, items) => {
        res.send(items);
        // console.log(items);
      })
    })

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log('adding new event', newBook);
        bookCollection.insertOne(newBook)
        .then(result => {
            console.log('inserted count',result.insertedCount)
            res.send(result.insertedCount > 0)
        })

    })

    app.post('/addOrder', (req, res) => {
      const newOrder = req.body;
      console.log(newOrder);
      orderCollection.insertOne(newOrder)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0);
      })

    })

    app.get('/orders', (req, res) => {
      // console.log(req.query.email);


      orderCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    app.delete(`/delete/:id`, (req, res) => {
      console.log(req.params.id);
      bookCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then((documents) =>{
        // console.log(documents);
      })


    })


//   client.close();
});




app.listen(port)