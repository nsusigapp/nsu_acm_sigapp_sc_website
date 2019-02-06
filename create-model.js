const SequelizeAuto = require('sequelize-auto')
const auto = new SequelizeAuto('nsu_sigapp_sc', 'root', '123456');

auto.run(function (err) {
  if(err) 
      throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});
