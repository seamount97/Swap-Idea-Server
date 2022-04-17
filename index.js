const express = require('express')
const cors = require('cors')
const { MongoClient } = require("mongodb");
var ObjectId = require('mongodb').ObjectId;
// const { append } = require('vary');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n3v1i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('ideaSwap');
        console.log("connected to db")
        const coursesCollection = database.collection('courses');
        const feedbacksCollection = database.collection('feedbacks');
        const usersCollection = database.collection('users');
        // const reviewsCollection = database.collection('reviews');

        // get Courses api
        app.get('/courses', async (req, res) => {
            const cursor = coursesCollection.find({})
            const courses = await cursor.toArray()
            res.json(courses)
        })

        // get feedbacks api
        app.get('/feedbacks', async (req, res) => {
            const cursor = feedbacksCollection.find({})
            const feedbacks = await cursor.toArray() // carefully use await
            res.json(feedbacks)
        })

        // get users api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray() // carefully use await
            res.json(users)
        })

        // Feedback API 
        app.post('/feedbacks', async (req, res) => {
            const feeedback = req.body
            const result = await feedbacksCollection.insertOne(feeedback)
            res.json(result)
        })
        // post courses API 
        app.post('/courses', async (req, res) => {
            const courses = req.body
            const result = await coursesCollection.insertOne(courses)
            res.json(result)
        })

        // Delete FEEDBACKS API
        app.delete('/feedbacks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await feedbacksCollection.deleteOne(query);
            console.log('deleting feedback id ', result);
            res.json(result);
        })
        // Delete USERS API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('deleting feedback id ', result);
            res.json(result);
        })
        // Delete COURSE API
        app.delete('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await coursesCollection.deleteOne(query);
            res.json(result);
        })

        // Set users info in database
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })
        // Set Admin role in database
        app.put('/users', async (req, res) => {
            const user = req.body
            console.log('put', user)
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })
        // Find Admin role in database
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        // Get single course details API
        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id
            console.log('getting id', id)
            const query = { _id: ObjectId(id) }
            const myCourse = await coursesCollection.findOne(query)
            res.json(myCourse)
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

