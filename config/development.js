const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  server: {
    port: process.env.PORT || 8080,
  },
};
