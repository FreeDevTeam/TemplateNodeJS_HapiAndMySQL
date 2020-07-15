const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  pool: { min: 0, max: 10 }
});

// Create a table
knex.schema.createTable('users', table => {
  table.increments('id');
  table.string('username').unsigned();
  table.string('password');
  table.string('email');
  table.boolean('admin');
});

module.exports = {
  DB: knex
};
