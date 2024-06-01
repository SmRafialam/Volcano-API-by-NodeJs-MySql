const knex = require('knex');

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
  

