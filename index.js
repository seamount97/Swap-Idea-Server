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
        // Set Admin role in database
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


// const courses = [
//     {
//         name: "Java",
//         description: "Java is one of the powerful general-purpose programming languages, created in 1995 by Sun Microsystems (now owned by Oracle). Java is Object-Oriented. However, it is not considered as pure object-oriented as it provides support for primitive data types (like int, char, etc). Java syntax is similar to C/C++",
//         img: "https://i.ibb.co/NjK8Vqc/java.jpg",
//         short_title: "We offer you the complete guidline to be a app developer",
//         videos: [
//             {
//                 link: "https://youtu.be/DTZAz9rj0kU",
//                 topic: "Java Installation And Getting Ready To Start Programming"
//             },
//             {
//                 link: "https://youtu.be/AVpLMoTnwM8",
//                 topic: "Java Open Source Projects For Concept Clearing"
//             },
//             {
//                 link: "https://youtu.be/vJ-Zn4fo0MQ",
//                 topic: "Java Tutorial on Java Servlets, JSP, JDBC etc.",
//             },
//             {
//                 link: "https://youtu.be/eIrMbAQSU34",
//                 topic: "Java Crash Course Tutorial"
//             },
//         ]
//     },
//     {
//         name: "Pyton AI",
//         description: "Python is an interpreted high-level general-purpose programming language. Its design philosophy emphasizes code readability with its use of significant indentation. Its language constructs as well as its object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects.",
//         img: "https://i.ibb.co/tPR4Nxy/py.jpg",
//         short_title: "Learn Python AI and deep learning course using Python language",
//         videos: [
//             {
//                 link: "https://youtu.be/WvhQhj4n6b8",
//                 topic: "What is Python? Python Programming For Beginners ",
//             },
//             {
//                 link: "https://youtu.be/kqtD5dpn9C8",
//                 topic: "Python Development For All"
//             },
//             {
//                 link: "https://youtu.be/woVJ4N5nl_s",
//                 topic: "Python Basics Tutorial For Beginners"
//             },
//             {
//                 link: "https://youtu.be/_uQrJ0TkZlc",
//                 topic: "Python Tutorial - Mastering Python"
//             },
//         ]
//     },
//     {
//         name: "JavaScript",
//         description: "JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat etc",
//         img: "https://i.ibb.co/VwZGRfG/JS.png",
//         short_title: "Become a successful web engineer after mastering in JavaScript",
//         videos: [
//             {
//                 link: "https://youtu.be/upDLs1sn7g4",
//                 topic: "What is JavaScript? Why We Should Know It? ",
//             },
//             {
//                 link: "https://youtu.be/eIrMbAQSU34",
//                 topic: "JavaScript Tutorial For Newbea Programmers"
//             },
//             {
//                 link: "https://youtu.be/47slmYwH8Rk",
//                 topic: "JavaScript Basics Projects For Skill Development"
//             },
//             {
//                 link: "https://youtu.be/PkZNo7MFNFg",
//                 topic: "A Complete Guidline to JavaScript"
//             },
//         ]
//     },
//     {
//         name: "React JS",
//         description: "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debug.",
//         img: "https://i.ibb.co/HzWhY8R/react.jpg",
//         short_title: "If front End development is your target then React is best for you!",
//         videos: [
//             {
//                 link: "https://youtu.be/Y6aYx_KKM7A",
//                 topic: "What is React JS | What is The Purpose to Learn",
//             },
//             {
//                 link: "https://youtu.be/Ke90Tje7VS0",
//                 topic: "Learn React JS And Become a FrontEnd Developer "
//             },
//             {
//                 link: "https://youtu.be/0riHps91AzE",
//                 topic: "React Mastering Projects "
//             },
//             {
//                 link: "https://youtu.be/w7ejDZ8SWv8",
//                 topic: "React Crash Course | MERN development Progress"
//             },
//         ]
//     },
//     {
//         name: "C++",
//         description: "C++ is a powerful general-purpose programming language. It can be used to develop operating systems, browsers, games, and so on. C++ supports different ways of programming like procedural, object-oriented, functional, and so on. This makes C++ powerful as well as flexible.",
//         img: "https://i.ibb.co/1rpTLPk/cplus.png",
//         short_title: "Our C++ programming tutorial will guide you to learn C++ programming one step at a time.",
//         videos: [
//             {
//                 link: "https://youtu.be/kJkB_Tggk8U",
//                 topic: "What is C++?",
//             },
//             {
//                 link: "https://youtu.be/xAeiXy8-9Y8",
//                 topic: "Learn C++ For Compititive Programming"
//             },
//             {
//                 link: "https://youtu.be/m2xt5KIEHvc",
//                 topic: "C++ Projects For Concept Clearing"
//             },
//             {
//                 link: "https://youtu.be/vLnPwxZdW4Y",
//                 topic: "Complete Roadmap Course"
//             },
//         ]
//     },
//     {
//         name: "PHP",
//         description: "PHP is a general-purpose scripting language geared towards web development. It was originally created by Danish-Canadian programmer Rasmus Lerdorf in 1994. The PHP reference implementation is now produced by The PHP Group",
//         img: "https://i.ibb.co/ngRXXG7/PHP.jpg",
//         short_title: "Build your modern app will guide you to learn C++ programming one step at a time.",
//         videos: [
//             {
//                 link: "https://youtu.be/mBL9Athx7ms",
//                 topic: "What is PHP ?",
//             },
//             {
//                 link: "https://youtu.be/r9ndOH0tyfA",
//                 topic: "Learn PHP For Web Development"
//             },
//             {
//                 link: "https://youtu.be/2eebptXfEvw",
//                 topic: "PHP Projects Course - Become Concept Master"
//             },
//             {
//                 link: "https://youtu.be/OK_JCtrrv-c",
//                 topic: "PHP Development Master Course"
//             },
//         ]
//     },
//     {
//         name: "TypeScript",
//         description: "TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for the development of large applications and transcompiles to JavaScript.",
//         img: "https://i.ibb.co/r3J77Gh/typeScr.png",
//         short_title: "TypeScript is a strongly typed progde you to learn C++ programming one step at a time.",
//         videos: [
//             {
//                 link: "https://youtu.be/i43W0XSiuIE",
//                 topic: "What is TypeScript? Aspects and Details ",
//             },
//             {
//                 link: "https://youtu.be/NjN00cM18Z4",
//                 topic: "Learn TypeScript For React Programming"
//             },
//             {
//                 link: "https://youtu.be/1jMJDbq7ZX4",
//                 topic: "TypeScript Course In ReactJS - TypeScript"
//             },
//             {
//                 link: "https://youtu.be/jrKcJxF0lAU",
//                 topic: "TypeScript Crash Course [Complete Roadmap]"
//             },
//         ]
//     },
//     {
//         name: "Kotlin",
//         description: "Kotlin is a cross-platform, statically typed, general-purpose programming language with type inference. Kotlin is designed to interoperate fully with Java, and the JVM version of Kotlin's standard library depends on the Java Class Library, but type inference allows its syntax to be more concise.",
//         img: "https://i.ibb.co/FqhhsdQ/kotlin.png",
//         short_title: "Build your modern app using kotlin langly typed progde you to learn C++ programming one step at a time.",
//         videos: [
//             {
//                 link: "https://youtu.be/R1A40X3iO5o",
//                 topic: "What is Kotlin? Know Kotlin's Future",
//             },
//             {
//                 link: "https://youtu.be/WvwwL0TwH6U",
//                 topic: "Learn Kotlin For Mobile App Development"
//             },
//             {
//                 link: "https://youtu.be/F9UC9DY-vIU",
//                 topic: "Kotlin Projects Based Tutorial"
//             },
//             {
//                 link: "https://youtu.be/wuiT4T_LJQo",
//                 topic: "Complete Kotlin Mastering Guidline"
//             },
//         ]
//     },
// ]