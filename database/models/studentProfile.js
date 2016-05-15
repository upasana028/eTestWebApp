module.exports = function(sequelize,DataTypes){
return sequelize.define('studentProfile', {
	username:{
		type: DataTypes.STRING,
		allowNull: false
	},
	roll:{
		type: DataTypes.STRING,
		allowNull: false,
		unique: 'compositeIndex'
	},
	admno:{
		type: DataTypes.STRING,
		allowNull: true
	},
	email:{
		type: DataTypes.STRING,
		allowNull: false
	},
	password:{
		type: DataTypes.STRING,
		allowNull: false
	},
	school:{
		type: DataTypes.STRING,
		allowNull: false,
		unique: 'compositeIndex'
	},
	studClass:{
		type: DataTypes.STRING,
		allowNull: false,
		validate:{
			len: [1,2]
		}
	},
	section:{
		type: DataTypes.STRING,
		allowNull: false,
		validate:{
			len: [1]
		},
		unique: 'compositeIndex'
	}
	

});
};

//registerStudent?username=upsana&email=aesf&password=1212&class=12&section=A&roll=1212
