// server.js
const express = require('express');
const db = require('./db'); // Import the Knex instance

const app = express();
const PORT = process.env.PORT || 3000;

// Example endpoint to get all volcanoes
app.get('/volcanoes', async (req, res) => {
  try {
    console.log(res)
    const volcanoes = await db.select('*').from('volcanoes'); // Ensure the table name is correct
    res.json(volcanoes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch volcanoes' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
