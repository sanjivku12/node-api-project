require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let studentsCollection;

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db("school");
    studentsCollection = db.collection("students");
    console.log("✅ Connected to MongoDB and ready");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
}

connectToMongo();

// GET /students - fetch all
app.get('/students', async (req, res) => {
  try {
    const students = await studentsCollection.find().toArray();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /students - add one
app.post('/students', async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) return res.status(400).json({ error: 'Name and age are required' });

  try {
    const result = await studentsCollection.insertOne({ name, age });
    res.status(201).json({ message: 'Student added', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
