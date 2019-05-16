const { users: User, Sequelize } = require("../models/index");

const Op = Sequelize.Op;

const checkUserNameAvailable = (req, res, next) => {

    const userName = req.body.username;

    User.findOne({
        attributes: ["user_name"],
        where: {
            user_name: userName
        }
    })
        .then(user => {

            if (user !== null) {

                return res.json({
                    available: false
                });

            } else {

                return res.json({
                    available: true
                });
            }
        })
        .catch(err => console.log(err));
}

module.exports = {
    checkUserNameAvailable
}