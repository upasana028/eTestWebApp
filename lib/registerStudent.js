
var _ = require('underscore');
var Q = [];

module.exports={
	setStud:function (objStud,db,callback){
	db.studProfile.create({

	username:objStud.username,
	roll:objStud.rollno,
	email:objStud.email,
	password:objStud.password,
	school:objStud.school,
	studClass:objStud.studclass,
	section:objStud.section
	
	}).then(function(obj){
		console.log("succes");
		return callback("1");

	}).catch(function(e){
	console.log(e);
	return  callback("0");
});
},
	getStud:function(QuestionsList,db){
		var TestObjects = {};
		var i =0;
		var TestSet = [];
		QuestionList = JSON.parse(QuestionsList)
			for (var i = QuestionList.length - 1; i >= 0; i--) {
			 	
			  var id = QuestionList[i].qQuestionId;
				//var $scope = {};
					db.query('SELECT * FROM options, questions WHERE questions.id = options.qQuestionId and questions.id =  '+ id).then(function(data){
								TestSet.push((data));
							});
					
					};
				

			setTimeout(function(){
				return TestSet;
			},2000);
			
	}
}