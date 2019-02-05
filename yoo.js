var SequelizeAuto = require('sequelize-auto')
var auto = new SequelizeAuto('sigapp', 'root', '@VeGeta!!!');

auto.run(function (err) {
  if (err) throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});
