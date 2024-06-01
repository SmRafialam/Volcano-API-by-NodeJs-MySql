// server.js
const express = require('express');
// const db = require('./db'); // Import the Knex instance
const Knex = require('knex');
const knex = Knex(require('./knexdb').development); // Use specific development config
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

// Middleware to parse URL-encoded bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Swagger setup
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
// console.log(require('crypto').randomBytes(64).toString('hex'));

app.get('/me', (req, res) => {
  // console.log(req);
  try{
    const loggedInUser = {
      name: "Mike Wazowski",
      student_number: "n1234567"
    };
    console.log(loggedInUser);
  
    res.json(loggedInUser);
  }catch(err){
    console.log(err);
  }
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
          dob: user.dob,
          address: user.address
      };

      res.json(profile);
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch user profile' });
  }
});

// PUT /user/{email}/profile endpoint
app.put('/user/:email/profile', authenticateToken, async (req, res) => {
  const { email } = req.params;
  const { firstName, lastName, password, dob, address } = req.body;
  console.log(req.body);

  // if (req.user.email !== email) {
  //     return res.status(403).json({ error: true, message: 'Forbidden' });
  // }

  try {
      const user = await knex('users').where({ email }).first();
      console.log(user);
      if (!user) {
          return res.status(404).json({ error: true, message: 'User not found' });
      }

      const updatedUserData = { firstName, lastName, dob, address };
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updatedUserData.password = hashedPassword;
      }

      await knex('users').where({ email }).update(updatedUserData);

      const updatedUser = await knex('users').where({ email }).first();
      res.json({
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          dob: updatedUser.dob,
          address: updatedUser.address
      });
  } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: true, message: 'Failed to update user profile' });
  }
});

app.get('/user/:email/favorites', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await knex('users').where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favorites = await knex('favorites')
      .join('data', 'favorites.volcano_id', '=', 'data.id')
      .where('favorites.user_id', user.id)
      .select('data.*');

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve favorite volcanoes' });
  }
});


app.post('/user/:email/favorite-volcano', async (req, res) => {
  const { email } = req.params;
  const { volcano_id } = req.body;

  if (!volcano_id) {
    return res.status(400).json({ error: 'Volcano ID is required' });
  }

  try {
    const user = await knex('users').where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('favorites').insert({
      user_id: user.id,
      volcano_id
    });

    res.status(201).json({ message: 'Volcano marked as favorite' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark volcano as favorite' });
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

app.get('/countries', async (req, res) => {
  try {
    // Get unique countries from the volcanoes table
    const countries = await knex('data')
      .distinct('country')
      .orderBy('country', 'asc')
      .pluck('country');

    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch countries' });
  }
});

// Example endpoint to get all volcanoes
app.get('/volcanoes', async (req, res) => {
  const { country, populatedWithin } = req.query;

  if (!country) {
    return res.status(400).json({
      error: true,
      message: 'Missing country query parameter',
    });
  }

  try {
    let query = knex('data').where('country', country);

    if (populatedWithin) {
      const validDistances = ['5km', '10km', '30km', '100km'];
      if (!validDistances.includes(populatedWithin)) {
        return res.status(400).json({
          error: true,
          message: 'Invalid populatedWithin parameter',
        });
      }

      const column = `population_${populatedWithin}`;
      query = query.where(column, '>', 0);
    }

    const volcanoes = await query.select('id', 'name', 'country', 'region', 'subregion');
    res.json(volcanoes);
  } catch (error) {
    console.error('Error fetching volcanoes:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch volcanoes',
    });
  }
});

app.get('/volcano/:id/photos', async (req, res) => {
  const { id } = req.params;

  try {
    const photos = await knex('photos').where('volcano_id', id);

    if (photos.length === 0) {
      return res.status(404).json({ message: 'No photos found for this volcano' });
    }

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve photos' });
  }
});


app.post('/volcano/:id/photo', authenticateToken, upload.single('file'), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'Photo file is required' });
  }

  try {
    const newPhoto = await knex('photos').insert({
      volcano_id: id,
      user_id: req.user.id,
      file_path: req.file.path
    });

    res.status(201).json({ message: 'Photo uploaded successfully', photo: newPhoto });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photo' });
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
app.get('/volcano/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const volcano = await knex('data').where({ id }).first();

    if (!volcano) {
      return res.status(404).json({ error: true, message: 'Volcano not found' });
    }

    const response = {
      id: volcano.id,
      name: volcano.name,
      country: volcano.country,
      region: volcano.region,
      subregion: volcano.subregion,
      last_eruption: volcano.last_eruption,
      summit: volcano.summit,
      elevation: volcano.elevation,
      latitude: volcano.latitude,
      longitude: volcano.longitude,
    };

    if (req.user) {
      response.population_5km = volcano.population_5km;
      response.population_10km = volcano.population_10km;
      response.population_30km = volcano.population_30km;
      response.population_100km = volcano.population_100km;
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching volcano:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch volcano' });
  }
});


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

// GET /volcano/{id}/comments
app.get('/volcano/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await knex('comments').where('volcano_id', id);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comments and ratings' });
  }
});

// POST /volcano/{id}/comment
app.post('/volcano/:id/comment', async (req, res) => {
  const { id } = req.params;
  const { Authorization } = req.headers;
  const { user_id, comment, rating } = req.body;

  if (!Authorization) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  if (!user_id || !comment || rating === undefined) {
    return res.status(400).json({ error: 'User ID, comment, and rating are required' });
  }

  try {
    await knex('comments').insert({ volcano_id: id, user_id, comment, rating });
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// app.post('/volcano/:id/comment', async (req, res) => {
//   const { id } = req.params;
//   const { comment, rating } = req.body;

//   // if (!comment || !rating) {
//   //   return res.status(400).json({ error: 'Comment and rating are required' });
//   // }

//   try {
//     const newComment = await knex('comments').insert({
//       volcano_id: id,
//       user_id: req.user.id,
//       comment,
//       rating
//     });

//     res.status(201).json({ message: 'Comment added successfully', comment: newComment });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add comment' });
//   }
// });


// User registration endpoint
app.post("/user/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  try {
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUserId] = await knex('users').insert({ email, password: hashedPassword });

    const newUser = await knex('users').where({ id: newUserId }).first();
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User created", token, token_type: "Bearer", expires_in: 3600 });
  } catch (err) {
    console.error('Error during registration:', err); // Log the error for debugging
    res.status(500).json({ error: true, message: "Error! Something went wrong." });
  }
});

// User login endpoint
app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  try {
    const existingUser = await knex('users').where({ email }).first();
    console.log(existingUser);
    if (!existingUser) {
      return res.status(401).json({ error: true, message: "Incorrect email or password" });
    }

    const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
    // console.log(token);
    res.status(200).json({ token, token_type: "Bearer", expires_in: 3600 });
  } catch (err) {
    console.error('Error during login:', err); // Log the error for debugging
    res.status(500).json({ error: true, message: "Error! Something went wrong." });
  }
});

// Additional endpoints
// Example GET endpoint: Retrieve volcanoes within a certain range
app.get('/volcanoes/nearby', async (req, res) => {
  const { km, lat, long } = req.query;

  if (!km || !lat || !long) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const volcanoes = await knex('data'); // Assuming the volcanoes are stored in 'data' table

    const nearbyVolcanoes = volcanoes.filter(v => {
      const distance = calculateDistance(lat, long, v.latitude, v.longitude);
      return distance <= km;
    });

    res.status(200).json(nearbyVolcanoes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve nearby volcanoes' });
  }
});

app.get('/volcano/:id/average-rating', async (req, res) => {
  const { id } = req.params;

  try {
    const averageRating = await knex('comments')
      .where('volcano_id', id)
      .avg('rating as average')
      .first();

    res.status(200).json({ averageRating: averageRating.average });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate average rating' });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
