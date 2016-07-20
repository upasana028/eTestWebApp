module.exports = function(sequelize,DataTypes){
return sequelize.define('questionsImage',{
	qQuestionId : {
		type: DataTypes.STRING,
		allowedNull : false
	},
	qImagePath : {
		type: DataTypes.STRING,
		allowedNull : false
	}
});
};