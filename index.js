const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Simple route
app.get('/weldobne', (req, res) => {
  res.send('Welcome to your Node.js API!');
});

// Examp
  
  const fs = require('fs');

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const entry = `[${new Date().toISOString()}] ${name} - ${email} - ${message}\n`;
  fs.appendFileSync('contacts.txt', entry);
  res.json({ success: true, message: "Saved to file!" });
});


app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
