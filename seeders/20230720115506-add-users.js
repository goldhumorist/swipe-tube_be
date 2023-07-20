/** @type {import('sequelize-cli').Migration} */

const { Op } = require('sequelize');

const bcrypt = require('bcrypt');

const config = require('config');
const schema = config.get('database').schema;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'users',
        schema,
      },
      [
        {
          username: 'seedUser1',
          email: 'seedEmail1@seed.com',
          password: await bcrypt.hash('aa!1Bbbbbbbbbbbbbb', 12),
          avatar_url_path:
            'https://d3mx3d301wrs50.cloudfront.net/default_profile_image.jpg',
          created_at: Sequelize.fn('now'),
          updated_at: Sequelize.fn('now'),
        },
        {
          username: 'seedUser2',
          email: 'seedEmail2@seed.com',
          password: await bcrypt.hash('aa!1Bbbbbbbbbbbbbb', 12),
          avatar_url_path:
            'https://d3mx3d301wrs50.cloudfront.net/default_profile_image.jpg',
          created_at: Sequelize.fn('now'),
          updated_at: Sequelize.fn('now'),
        },
        {
          username: 'seedUser3',
          email: 'seedEmail3@seed.com',
          password: await bcrypt.hash('aa!1Bbbbbbbbbbbbbb', 12),
          avatar_url_path:
            'https://d3mx3d301wrs50.cloudfront.net/default_profile_image.jpg',
          created_at: Sequelize.fn('now'),
          updated_at: Sequelize.fn('now'),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'users',
        schema,
      },
      {
        [Op.or]: [
          { username: 'seedUser1' },
          { username: 'seedUser2' },
          { username: 'seedUser3' },
        ],
      },
    );
  },
};
