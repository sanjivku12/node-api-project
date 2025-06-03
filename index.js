require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT||3000;

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let studentsCollection;

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db("school");
    studentsCollection = db.collection("students");
    usersCollection = db.collection('users');
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
//user registration 
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({
    username,
    password: hashedPassword,
    role: 'user'  // default role
  });

  res.json({ message: 'User registered successfully' });
});

// update student by id

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await studentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Invalid ID or server error' });
  }
});

// delete student by id
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await studentsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID or server error' });
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
