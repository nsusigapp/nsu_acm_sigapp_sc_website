const { users: User, Sequelize } = require("../models/index");

const Op = Sequelize.Op;

const checkUserNameAvailable = async (req, res, next) => {

    if (req.query.username) {

        const userName = req.query.username;

        try {
            
        } catch (err) {

            console.log(err);
        }
    
        const user = await User.findOne({
            attributes: ["user_name"],
            where: {
                user_name: userName
            }
        });
            
    
        if (user !== null) {

            return res.json({
                available: false
            });

        } else {
    
            return res.json({
                available: true
            });
        }

    } else {
        
        return res.json({
            error: "key not defined",
        });
    }

}

module.exports = {
    checkUserNameAvailable
}