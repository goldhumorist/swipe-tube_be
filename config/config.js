const dotenv = require('dotenv');
const config = require('config');

dotenv.config();

module.exports = {
  [process.env.NODE_ENV]: config.get('database'),
};
