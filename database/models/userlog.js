module.exports = function(sequelize,DataTypes){
return sequelize.define('userlog',{
	userEmail : {
		type: DataTypes.STRING,
		allowedNull : true
	},
	userSchoolName : {
		type: DataTypes.STRING,
		allowedNull : true
	},
	userDate : {
		type: DataTypes.DATE,
		allowedNull : false
	},
	userFileHit : {
		type: DataTypes.STRING,
		allowedNull : true
	}
});
};