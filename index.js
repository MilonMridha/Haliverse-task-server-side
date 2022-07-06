const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// middle wares ------------------- 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t7ino.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("db connected");

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("heliverse").collection("users");

        app.post("/auth/register", async (req, res) => {
            const data = req.body;
            const email = data.email;
            const userPass = data.password;
            const name = data.name;
            const password = await bcrypt.hash(userPass, 10);
            const users = await userCollection.find({}).toArray();

            let isUser;
            users.forEach(user => {

                if (user.email === email) {
                    return isUser = true
                } else {
                    return isUser = false
                }
            })
            if (isUser) {
                console.log(isUser)
                res.send({ message: "User already registered" })
            }
            else {
                const newUser = { name, email, password }
                const result = await userCollection.insertOne(newUser)
                res.send(result)
            }
        });

        app.post("/auth/login", async (req, res) => {
            const email = req.body.email;
            console.log(email)
            const password = req.body.password;
            const user = await userCollection.findOne({ email });
            console.log(user)
            if (!user) {
                return res.send({ message: "User & password does not exist" })
            }
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1h'
                })
                if (token) {
                    return res.send({ message: "Successful", token })
                }
                else {
                    res.send({message: "User & password does not exist"})
                }
            }
            res.send({message: "User & password does not exist"})
        });
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Heliverse task is running')
});

app.listen(port, () => {
    console.log(`Heliverse listening on port ${port}`)
});