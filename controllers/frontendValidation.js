
const { users: User } = require("../models/index");

const checkUserNameAvailable = async (req, res, next) => {

    try {

        if (req.query.username) {

            const userName = req.query.username;

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
            }
        
            return res.json({
                available: true
            });
        }
            
        return res.json({
            error: "key not defined",
        });
        
    } catch (err) {

        console.log(err);
    }
}

module.exports = {
    checkUserNameAvailable
}