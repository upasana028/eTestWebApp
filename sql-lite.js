var Sequelize = require('sequelize');
var sequelize= new Sequelize(undefined,undefined,undefined,{
	'dialect': 'sqlite',
	'storage': __dirname +'/database/data/basic-db.sqlite'
});

var db = {};
var str = __dirname;
db.question = sequelize.import(str + "/database/models/question.js");
db.qOptions = sequelize.import(str + "/database/models/options.js");
db.qAnswer = sequelize.import(str + "/database/models/answer.js")
db.eTest = sequelize.import(str + "/database/models/etest.js");
db.eTestQue = sequelize.import(str + "/database/models/test-question.js");
db.userlog = sequelize.import(str + "/database/models/userlog.js");
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;

// var ETest = 

sequelize.sync().then(function(){
	console.log("everytihg is set!");
})