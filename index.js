const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Server is ok');
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${db_user}:${db_password}@cluster0.nevhe4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		const coffeeCollection = client.db('coffeeDB').collection('coffee');

		app.get('/coffee', async (req, res) => {
			const cursor = coffeeCollection.find();
			const coffeeData = await cursor.toArray();
			res.send(coffeeData);
			// console.log(coffeeData);
		});
		app.get('/coffee/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await coffeeCollection.findOne(query);
			res.send(result);
		});

		app.post('/coffee', async (req, res) => {
			const newCoffee = await req.body;
			const result = await coffeeCollection.insertOne(newCoffee);
			res.send(result);
		});

		app.delete('/coffee/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await coffeeCollection.deleteOne(query);
			res.send(result);
		});
		app.put('/coffee/:id', async (req, res) => {
			const id = req.params.id;
			const coffeeData = req.body;
			const updatedCoffee = {
				$set: {
					coffeeName: coffeeData.coffeeName,
					chef: coffeeData.chef,
					supplier: coffeeData.supplier,
					taste: coffeeData.taste,
					catagory: coffeeData.catagory,
					details: coffeeData.details,
					photoURL: coffeeData.photoURL,
				},
			};

			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const result = await coffeeCollection.updateOne(
				filter,
				updatedCoffee,
				options,
			);
			res.send(result);
		});
		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!',
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();0
		//   zurD5GFUKXEVo4Re
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`server is running at http://localhost:${port}`);
});
