const knex = require('knex');

// module.exports = {

//     development: {
//       client: 'mysql2',
//       // connection: {
//       //   filename: './dev.sqlite3'
//       // }
//       connection: {
//           host: '127.0.0.1',
//           port: 3306,
//           user: 'root',
//           password: '',
//           database: 'volcano'
//         }
//     },
//   };

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
          password: '',
          database: 'volcanoes'
        }
    },
  };
  
// // Knex configuration
// const knexConfig = {
//   client: 'mysql2',
//   connection: {
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: '', // Assuming no password for root user as per original code
//     database: 'volcano'
//   }
// };

// // Initialize knex
// const db = knex(knexConfig);

// // Query the users table
// db('volcanoes')
//   .select('*')
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.error(err);
//   })
//   .finally(() => {
//     db.destroy();
// });

