const SequelizeAuto = require('sequelize-auto')
const auto = new SequelizeAuto('sigapp', 'root', '');

auto.run(function (err) {
  if(err) 
      throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});
