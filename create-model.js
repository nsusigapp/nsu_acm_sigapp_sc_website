// const SequelizeAuto = require('sequelize-auto')
// const auto = new SequelizeAuto('nsu_sigapp_sc', 'root', '123456');

// auto.run(function (err) {
//   if(err) 
//       throw err;

//   console.log(auto.tables); // table list
//   console.log(auto.foreignKeys); // foreign key list
// });

// const db= require("./models/index");

// db.sequelize.sync();

const {users}= require("./models/index");

// console.log(users.generateAuthToken());

users.create({
  nsu_id: "1711552642",
  role_id: 2,
  first_name: "Muiqur",
  last_name: "Rahman",
  user_name: "mrsscsaa",
  nsu_email: "12@nsu.com",
  alt_email: "baal@saal.com",
  password: "12612hsdajsdh",
  avatar_url: "yoo",
  status: 1,
  token: users.generateAuthToken({
      id: 12,
      user_name: "yoo",
  })
}).then(result => console.log(result)).catch(err => console.log(err));

// users.test();

// const config= require("config");

// console.log(config.get("auth").jwtsecret);