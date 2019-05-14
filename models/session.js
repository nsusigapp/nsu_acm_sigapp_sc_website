/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	const Session = sequelize.define('session', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true

        },
        sess_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ip_addr: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        sess_status: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        }
	}, {
		tableName: 'session'
    });
    
    Session.association = models => {

        Session.belongsTo(models.users, {
			foreignKey: "u_id",
		});
    }

	return Session;
};
