
// example skeleton of a DB migration file
// RUN MIGRATIONS => npx sequelize-cli db:migrate
// UNDO MIGRATIONS => npx sequelize-cli db:migrate:undo <= IN CASE OF ERROR
// queryInterface is used for all database communications by Sequelize; ex: ALTER TABLE;


// up: is run for migrations
// down: is run for undo;

module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('users', 'example' , Sequelize.STRING);
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('users', 'example');
    }
  }