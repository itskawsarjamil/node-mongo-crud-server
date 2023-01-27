const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());


// const users = [
//     { name: "A", email: "a@gmail.com", id: 1, },
//     { name: "B", email: "B@gmail.com", id: 2, },
//     { name: "c", email: "c@gmail.com", id: 3, },
// ]

const uri = "mongodb+srv://dbuser2:PcFqgdDQHH4a2JFZ@cluster0.ygqjni4.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("nodemongocrud").collection("users");

        app.get("/", async (req, res) => {
            // const options = { ordered: true };
            // const result = await userCollection.insertMany(users, options);
            // console.log(result);
            res.send("node mongo crud server is running");
        })

        app.get("/users", async (req, res) => {
            const users = await userCollection.find({}).toArray();
            // console.log(users);
            return res.send(users);
        })
        app.post("/users", async (req, res) => {
            console.log(req.body);
            const data = req.body;
            const result = await userCollection.insertOne(data);
            console.log(result);
            return res.send(result);
        })
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log(result);
            return res.send(result);
        })
        app.get("/updateuser/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            // console.log(result);
            return res.send(result);
        })
        app.put("/updateuser/:id", async (req, res) => {
            const data = req.body;
            console.log(data);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateData = {
                $set: {
                    name: data.name,
                    email: data.email,
                }
            };
            const result = await userCollection.updateOne(filter, updateData, options);
            console.log(result);
            return res.send(result);
        })
    }
    finally {

    }
}

run().catch(e => console.log(e))



app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})