const SequelizeAuto = require('sequelize-auto'); // package to auto generate models from database;
const auto = new SequelizeAuto('nsu_sigapp_sc', 'root', '123456'); 
// ^^ set credentials; [dbName,Username,Password] ^^

/**
 * This part below creates model files from existing database;
 * Created by writing SQL in .sql files;
 * Use whenever necessary to make work faster; but make sure to create associations manually;
 * Auto generating models have issues; Such as ommiting foreignKey constraints;
 * Those needs to be manually added wth associations to be able to mae INNER JOIN and other types of queries;
 */

// auto.run(function (err) {
//   if(err) 
//       throw err;

//   console.log(auto.tables); // table list
//   console.log(auto.foreignKeys); // foreign key list
// });

// ^^ // ^^ // ^^ //

// This index file can be used to access all the model files together; Instead of manually requireing them;
const db = require("./models/index");
// ^^ this file reads all of the models from models folder and imports them in this global db variable;

// import all models for associations
const { roles: Role } = require("./models/index");

// All associations are defined here; Associations are foreignKeys joining tables;
// Associations allows you to run JOIN queries [INNER JOIN/OUTER JOIN] the sequelize way;
//  INSTEAD OF RUNNING RAW QUERIES; Raw queries should be avoided whenever possible;
//  Unless absolutely necessary; DO not run raw queries;


db.sequelize.sync({
    force: true
})
    .then(res => {

        Role.bulkCreate([
            { role_name: "USER" },
            { role_name: "ADMIN" }
        ]);

    })
    .catch(err => console.log(err));