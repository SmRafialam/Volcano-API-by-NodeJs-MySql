const knex = require('knex');
const knexFile = require('./knexfile.js');

const environment = process.env.NODE_ENV || 'development'; // Use 'development' by default
const db = knex(knexFile[environment]);

(async () => {
  try {
    console.log('Connecting to database...');
    await db.raw('SELECT 1 + 1 AS result'); // Simple query to test connection
    console.log('Connected successfully!');

    // Example query to view volcano data
    const volcanoes = await db.select('*').from('volcanoes');
    console.log('Volcanoes:', volcanoes);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await db.destroy(); // Close the connection (optional)
  }
})();