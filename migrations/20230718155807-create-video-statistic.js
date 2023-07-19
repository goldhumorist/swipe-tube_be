const config = require('config');
const schema = config.get('database').schema;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'video-statistic', schema },
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        video_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'videos',
            key: 'id',
          },
        },
        views_amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        likes_amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('now'),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      tableName: 'video-statistic',
      schema,
    });
  },
};
