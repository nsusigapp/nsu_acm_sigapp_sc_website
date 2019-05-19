const { users: User, Sequelize } = require("../models/index");

const Op = Sequelize.Op;

const checkUserNameAvailable = (req, res, next) => {

    if (req.query.username) {

        const userName = req.query.username;
    
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

    } else {
        
        return res.json({
            error: "key not defined",
        });
    }

}

module.exports = {
    checkUserNameAvailable
}