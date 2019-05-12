module.exports = function(sequelize, DataTypes) {
	return sequelize.define('about_us', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(45),
			allowNull: false
        },
        designation: {
            type: DataTypes.STRING(55),
			allowNull: false
        },
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'about_us'
	});
};