/* jshint indent: 1 */

/**
 * This is database email queue;
 * all emails should be queued and sent one by one periodically
 * emails should not be sent instantly;
 * there's a chance emails won't be sent concurrently
 * and will fail to reach users inbox;
 * thus this measure;
 * A script is created which runs at an interval of 1min
 * it checks for new entries in this table and dispatches the emails one by one;
 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('email_queue', {
		email_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		send_to: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		e_from: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		email_headers: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		email_description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		send_progress: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		sent_at: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'email_queue'
	});
};
