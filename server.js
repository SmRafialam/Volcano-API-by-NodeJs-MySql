// server.js
const express = require('express');
// const db = require('./db'); // Import the Knex instance
// import knex from './knexfile';
const Knex = require('knex');
const knex = Knex(require('./knexdb').development); // Use specific development config
const app = express();
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// Middleware to parse URL-encoded bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const SECRET_KEY = 'your_secret_key'; // Use a strong secret key

// Swagger setup
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));


// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = user;
      next();
  });
}

// Get logged-in user's profile (assuming authentication is implemented)
// app.get('/me', async (req, res) => {
//   // const loggedInUser = req.user;
//   try {
//     // res.json(loggedInUser);
//     res.json({
//       name: 'Mike Wazowski',
//       student_number: 'n1234567'
//   });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching user profile' });
//   }
// });

app.get('/me', authenticateToken, (req, res) => {
  const loggedInUser = {
    name: "Mike Wazowski",
    student_number: "n1234567"
  };
  res.json(loggedInUser);
});


// GET /user/{email}/profile endpoint
app.get('/user/:email/profile', authenticateToken, async (req, res) => {
  const { email } = req.params;

  if (req.user.email !== email) {
      return res.status(403).json({ error: true, message: 'Forbidden' });
  }

  try {
      const user = await knex('users').where({ email }).first();
      if (!user) {
          return res.status(404).json({ error: true, message: 'User not found' });
      }

      const profile = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          dob: user.dob,
          address: user.address
      };

      res.json(profile);
  } catch (error) {
      res.status(500).json({ error: true, message: 'Failed to fetch user profile' });
  }
});

// PUT /user/{email}/profile endpoint
app.put('/user/:email/profile', authenticateToken, async (req, res) => {
  const { email } = req.params;
  const { firstName, lastName, password, dob, address } = req.body;

  if (req.user.email !== email) {
      return res.status(403).json({ error: true, message: 'Forbidden' });
  }

  try {
      await knex('users')
          .where({ email })
          .update({ firstName, lastName, password, dob, address });

      const updatedUser = await knex('users').where({ email }).first();
      res.json({
          email: updatedUser.email,
          password: updatedUser.password,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          dob: updatedUser.dob,
          address: updatedUser.address
      });
  } catch (error) {
      res.status(500).json({ error: true, message: 'Failed to update user profile' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await knex.select('*').from('users');
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Example endpoint to get all volcanoes
app.get('/volcanoes', async (req, res) => {
  // console.log(res);
  try {
    // console.log(res);
    // const volcanoes = await db.select('*').from('volcanoes'); // Ensure the table name is correct
    const volcanoes = await knex.select('*').from('data');
    res.json(volcanoes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch volcanoes' });
  }
});

// Route to add a new user
app.post('/users', async (req, res) => {
  try {
    // Extract user data from the request body
    const userData = req.body;

    // Insert the user data into the database
    const result = await knex('users').insert(userData);

    // Return the newly created user
    res.status(201).json({ message: 'User created successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Route to add a new volcano
app.post('/volcanoes', async (req, res) => {
  try {
    // Extract volcano data from the request body
    const volcanoData = req.body;
    console.log(volcanoData);

    // Insert the volcano data into the database
    const result = await knex('volcanoes').insert(volcanoData);

    // Return the newly created volcano
    res.status(201).json({ message: 'Volcano created successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create volcano' });
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
// app.get('/user/:email/profile', async (req, res) => {
//   const { email } = req.params;
//   try {
//     // Assuming you have a 'users' table in your database
//     const user = await knex.select('*').from('users').where('email', email);
//     if (user.length === 0) {
//       res.status(404).json({ message: 'User not found' });
//     } else {
//       res.json(user[0]);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching user profile' });
//   }
// });

// app.put('/user/:email/profile', async (req, res) => {
//   const { email } = req.params;
//   const updates = req.body;
//   try {
//       const updated = await knex('users').where({ email }).update(updates);
//       if (!updated) return res.status(404).json({ message: 'User not found' });
//       res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//       res.status(500).json({ error: 'Failed to update user profile' });
//   }
// });

app.get('/volcanoes/search', async (req, res) => {
  const { name, location } = req.query;
  try {
      let query = knex('data');
      if (name) query = query.where('name', 'like', `%${name}%`);
      if (location) query = query.where('country', 'like', `%${location}%`);
      const results = await query;
      res.json(results);
  } catch (error) {
      res.status(500).json({ error: 'Failed to search volcanoes' });
  }
});

app.post('/volcanoes/:id/comment', async (req, res) => {
  const { id } = req.params;
  const { user_id, comment } = req.body;
  if (!user_id || !comment) return res.status(400).json({ error: 'User ID and comment are required' });

  try {
      await knex('comments').insert({ volcano_id: id, user_id, comment });
      res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
