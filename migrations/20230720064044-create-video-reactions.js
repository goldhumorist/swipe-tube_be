const config = require('config');
const schema = config.get('database').schema;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'video-reactions', schema },
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        video_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'videos',
            key: 'id',
          },
        },
        reaction_title: {
          type: Sequelize.ENUM('LIKE', 'DISLIKE'),
          allowNull: true,
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
      tableName: 'video-reactions',
      schema,
    });
  },
};
