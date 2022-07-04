const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// middle wares ------------------- 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t7ino.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("db connected");



app.get('/', (req, res) => {
    res.send('Heliverse task is running')
})

app.listen(port, () => {
    console.log(`Heliverse listening on port ${port}`)
})