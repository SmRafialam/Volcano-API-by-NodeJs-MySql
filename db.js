// // db.js
// const knex = require('knex');
// const config = require('./knexfile');

// console.log('Knex Configuration:', config.development); // Add this line to check the configuration

// const db = knex(config.development);

// module.exports = db;
const knex = require("knex");
const knexFile = require("./knexfile");

const environment = process.env.NODE_ENV || "development";

module.exports = knex(knexFile[environment]);