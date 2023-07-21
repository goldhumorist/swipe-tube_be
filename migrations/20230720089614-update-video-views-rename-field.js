const config = require('config');
const schema = config.get('database').schema;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      { tableName: 'video-views', schema },
      'author_id',
      'user_id',
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      { tableName: 'video-views', schema },
      'user_id',
      'author_id',
    );
  },
};
