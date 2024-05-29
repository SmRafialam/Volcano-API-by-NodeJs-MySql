// server.js
const express = require('express');
// const db = require('./db'); // Import the Knex instance
// import knex from './knexfile';
const Knex = require('knex');
const knex = Knex(require('./knexfile').development); // Use specific development config
const app = express();
// import mysql from 'mysql2/promise';
// const mysql = require('mysql2');
const PORT = process.env.PORT || 3000;

// Example endpoint to get all volcanoes
app.get('/volcanoes', async (req, res) => {
  try {
    console.log(res)
    // const volcanoes = await db.select('*').from('volcanoes'); // Ensure the table name is correct
    const volcanoes = await knex.select('*').from('volcanoes');
    res.json(volcanoes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch volcanoes' });
  }
});

// GET a volcano by ID
app.get('/volcanoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const volcano = await knex.select('*').from('volcanoes').where('id', id);
    if (volcano.length === 0) {
      res.status(404).json({ message: 'Volcano not found' });
    } else {
      res.json(volcano[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching volcano' });
  }
});

// Get user profile by email
app.get('/user/:email/profile', async (req, res) => {
  const { email } = req.params;
  try {
    // Assuming you have a 'users' table in your database
    const user = await knex.select('*').from('users').where('email', email);
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Get logged-in user's profile (assuming authentication is implemented)
app.get('/me', async (req, res) => {
  // Assuming you have extracted user information from the request object after authentication
  const loggedInUser = req.user;
  try {
    res.json(loggedInUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});


// const db =  mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'password',
//   database: 'volcanoes'
// });

// db.query(`Select * from volcanoes`,(error, result, fields)=> {
//   console.log(error);
//   console.log(result);
//   console.log(fields);
// })

// // Get a connection from the pool
// db.connect((err, connection) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL Server!');
//   // Use the connection
//   // For example: connection.query('SELECT * FROM table', (err, results) => { ... });

//   // Release the connection back to the pool
//   connection.release();
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
