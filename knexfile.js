// Update with your config settings.
const knex = require('knex');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    // connection: {
    //   filename: './dev.sqlite3'
    // }
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'volcanoes'
      }
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};

// knex(config)
//   .raw('CREATE DATABASE IF NOT EXISTS volcano;') // Create database if it doesn't exist (optional)
//   .raw('USE volcano;') // Use the volcano database
//   .raw(require('fs').readFileSync('./volcanoes.sql', 'utf-8')) // Assuming volcanoes.sql is in the same directory
//   .then(() => {
//     console.log('Database schema created successfully');
//   })
//   .catch(error => {
//     console.error('Error creating database schema:', error);
//   });