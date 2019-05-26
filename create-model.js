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
const { users: User, roles: Role, quotes: Quote, tags: Tag,
     forum: Forum, forum_answer: ForumAnswer, forum_tag: ForumTag } = require("./models/index");

// All associations are defined here; Associations are foreignKeys joining tables;
// Associations allows you to run JOIN queries [INNER JOIN/OUTER JOIN] the sequelize way;
//  INSTEAD OF RUNNING RAW QUERIES; Raw queries should be avoided whenever possible;
//  Unless absolutely necessary; DO not run raw queries;

/**
 * Associations have been moved to their respective model files
 * but the notes shall remain here for reference;
 */


db.sequelize.sync({
    force: true
})
    .then(res => {

        Role.bulkCreate([
            { role_name: "USER" },
            { role_name: "ADMIN" }
        ]);

        User.bulkCreate([
            {
                nsu_id: "1711552642",
                user_name: "MrScX",
                first_name: "Mushfiqur",
                last_name: "Rahman",
                nsu_email: "mushi@northsouth.edu",
                alt_email: "mushi@gmail.com",
                password: "123456",
                status: 1,
                role_id: 1,
                token: "asdasd2738917289312938123"
            },
            {
                nsu_id: "1711552643",
                user_name: "Lubba",
                first_name: "Lubba",
                last_name: "Saha",
                nsu_email: "luba@northsouth.edu",
                alt_email: "luba@gmail.com",
                password: "123456",
                status: 1,
                role_id: 1,
                token: "asdkjh12319283yasdasd"
            }
        ]);

        Quote.bulkCreate([
            { quote_text: "You are my password. People can unlock me through you" },
            { quote_text: "War, War Never Changes" }
        ]);

        Tag.bulkCreate([
            { tag_name: "AWS" },
            { tag_name: "React" },
            { tag_name: "JavaScript" },
            { tag_name: "Database" },
            { tag_name: "MySQL" },
        ]);

        Forum.bulkCreate([
            {
                f_post_title: "Learning JS through failing",
                f_post_description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam numquam ipsum saepe? Quo placeat ipsa, dignissimos, et eius nobis esse harum assumenda ullam quidem accusantium velit nemo cumque reiciendis exercitationem fuga necessitatibus! Neque doloribus sapiente cupiditate praesentium libero nihil iusto quae, quibusdam harum minima veritatis natus architecto qui dolores aspernatur laboriosam debitis. Sed ipsam voluptatibus sequi sunt autem praesentium ex blanditiis fuga, obcaecati fugiat hic odit exercitationem aperiam voluptatum tempora nobis dolore magni porro ab, ipsa molestias possimus necessitatibus nostrum? Harum corporis commodi molestias iste sunt, animi reiciendis rerum laboriosam corrupti sapiente exercitationem doloribus, quasi architecto dolor nemo, qui a.",
                like_count: 3,
                author_id: 1,
            },
            {
                f_post_title: "Python? What's that about",
                f_post_description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam numquam ipsum saepe? Quo placeat ipsa, dignissimos, et eius nobis esse harum assumenda ullam quidem accusantium velit nemo cumque reiciendis exercitationem fuga necessitatibus! Neque doloribus sapiente cupiditate praesentium libero nihil iusto quae, quibusdam harum minima veritatis natus architecto qui dolores aspernatur laboriosam debitis. Sed ipsam voluptatibus sequi sunt autem praesentium ex blanditiis fuga, obcaecati fugiat hic odit exercitationem aperiam voluptatum tempora nobis dolore magni porro ab, ipsa molestias possimus necessitatibus nostrum? Harum corporis commodi molestias iste sunt, animi reiciendis rerum laboriosam corrupti sapiente exercitationem doloribus, quasi architecto dolor nemo, qui a.",
                like_count: 10,
                author_id: 2,
            },
        ]);

        ForumAnswer.bulkCreate([
            {
                answer_content: "This is a vua answer from the BD",
                forum_p_id: 1,
                author_id: 1,
            },
            {
                answer_content: "This is another vua answer from the BD",
                forum_p_id: 1,
                author_id: 2,
            },
            {
                answer_content: "This is a vua answer from the BD",
                forum_p_id: 2,
                author_id: 1,
            }
        ]);

        ForumTag.bulkCreate([
            {
                f_post_id: 1,
                tag_id: 3
            },
            {
                f_post_id: 1,
                tag_id: 4
            },
            {
                f_post_id: 2,
                tag_id: 1
            }
        ]);

    })
    .catch(err => console.log(err));