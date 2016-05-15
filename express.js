var express = require('express');
var db = require("./sql-lite.js");
var app = express();
var createTest = require('./lib/createTest.js');
var createStudent = require('./lib/registerStudent.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Q = [];
var qArray = [];
app.use(express.static(__dirname+'/public'));
app.get('/home',function(req,res){
	res.send("Welcome to the world of Elearning");
});

app.get('/setQuestion',function(req,res){

var test = req.query['test'];
var fileName = req.query['fileName'];
var classNum = fileName.split('(')[0];
var Doi = fileName.split('DOI')[1].split('.')[0];
var packageName = fileName.split('.')[2];
var chapter = fileName.split('.'+packageName+'.')[1];
var testId = null;
var objTest = {};
var global_socket = null;
objTest.qClass = classNum;
objTest.qDOI = Doi;
objTest.qPackage = packageName;
objTest.qChapter = chapter;
objTest.qFileName = fileName;
createTest.setTest(objTest,test,db);

res.send("We got this test!");
});

app.get('/registerStudent',function(req,res){

var username = req.query['username'];
var email = req.query['email'];
var password = req.query['password'];
var studclass = req.query['class'];
var section = req.query['section'];
var rollno = req.query['roll'];
var school = req.query['school'];

//registerStudent?username=upsana&email=aesf&password=1212&class=12&section=A&roll=1212
var objTest = {};
objTest.username = username;
objTest.email = email;
objTest.password = password;
objTest.studclass = studclass;
objTest.section = section;
objTest.rollno = rollno;
objTest.school = school;
/*
/registerStudent?
username=upsana&
email=aesf&
school=a&
password=1212&
class=4&
section=B&
roll=121
*/

if(createStudent.setStud(objTest,db)){
	res.setHeader("Access-Control-Allow-Methods", "GET");
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Origin', 'http://www.learnmyway.in');
	
	
    res.send("YES");
}
else
	res.send("NO")
});


 io.on('connection',function(socket){
	console.log('User connection via socket::Server message');
		db.eTest.findAll().then(function(obj){
			var objJSON = JSON.stringify(obj);
		
		socket.emit('giveTests',{
			testsArray:objJSON
		});

		});

		socket.on('resultMaker',function(resultSet){
			//console.log(resultSet);
			var QuestionsList = JSON.stringify(resultSet);
			QuestionsList = JSON.parse(QuestionsList);
			var resultTotal = 0;
			var dbAnswers = [];
			var id = " " ;
			for (var i=0; i<= QuestionsList.length - 1;i++) {
			 			//var studAnswer = (QuestionsList[i].answer);
			 			if(i ==0)
			 				id = (QuestionsList[i].qid);
			 			else
			 			 id = id + "," + (QuestionsList[i].qid);
			 	}
			 	
			 	db.sequelize.query("SELECT qQuestionId,qAnswerOptionId from answers where qQuestionId IN ("+ id+")").then(function(data){
			 				
			 				
			 				dbAnswers.push(data[0]);
			 				
			 			}).then(function(){
//			 				console.log(dbAnswers);

			 				for (var i=0; i<= QuestionsList.length - 1;i++) {
			 			//var studAnswer = (QuestionsList[i].answer);
			 				if(QuestionsList[i].qid == dbAnswers[0][i].qQuestionId 
			 					&& QuestionsList[i].answer ==  dbAnswers[0][i].qAnswerOptionId){
                                   resultTotal = resultTotal + 1;
			 				}
			 					
			 			}

			 			socket.emit('giveResultTotal',{
								resultTotal:JSON.stringify(resultTotal)
						}) ;

			 	});

			 	
		});
		socket.on('populateTest',function(obj){
			var TestSet  = [];
			db.eTest.findAll({
				  where: {
				    qFileName:obj
				  }
			}).then(function(obj){
				console.log("----------------------------------");
				var idFromDb =(JSON.parse(JSON.stringify(obj))[0].id);
			console.log(idFromDb);
		db.eTestQue.findAll({
				where:{
					qTestId:idFromDb
				}
			}).then(function(data){
			console.log(data);
			var QuestionsList = JSON.stringify(data);
			QuestionsList = JSON.parse(QuestionsList);
			 for (var i=0; i<= QuestionsList.length - 1;i++) {
			 
			 	var id = QuestionsList[i].qQuestionId;
			 	db.sequelize.query('SELECT * FROM options, questions WHERE questions.id = options.qQuestionId and questions.id =  '+ id).then(function(data){
								
								var OptionsList = JSON.stringify(data);
								OptionsList = JSON.parse(OptionsList);
								var optionsSet = [];
								var obj1 = {};
								
									for (var i = OptionsList[0].length - 1; i >= 0; i--) {
										
										optionsSet.push(OptionsList[0][i].qOptionText);
										if(i == 0){
											obj1.qText = OptionsList[0][i].qText.trim();
											obj1.id = OptionsList[0][i].qQuestionId;
										}

									};
			 				 	 obj1.optionSet = optionsSet;

			 				 	 optionsSet = [];
			 				 	
								 TestSet.push(obj1);
							});

			 	
			 };
			}).then(function(){
                    
				setTimeout(function(){
					console.log(TestSet);
				socket.emit('giveTestSet',{
					ts:JSON.stringify(TestSet)
				}) ;
			},1500);

			});

			});
			
		
		});

	
socket.on('logUser',function(obj){
	obj = (JSON.parse(JSON.stringify(obj)));
	db.userlog.create({
	    		userEmail:obj.email,
	    		userSchoolName:obj.scName,
	    		userDate: Date(),
	    		userFileHit: obj.file,
	    		score:obj.score,
	    		total:obj.total
	    	});
});

socket.on('getMIS',function(req) {
	var d = new Date(req);
	var mon = d.getMonth();
	var day = d.getDate();
	if(mon<10)
		mon = "0"+mon;
	if(day<10)
		day = "0"+day;

	db.sequelize.query('select userEmail,userSchoolName,userFileHit,score,total from userlogs where userDate like "'+(d.getFullYear())+"-"+(mon)+"-"
		+(day)+'%" order by userSchoolName').then(function(obj) {
				socket.emit('giveMIS',{
					ts:JSON.stringify(obj)
				})
			});
});


});


db.sequelize.sync().then(function(){
		http.listen('8080',function(){
		console.log("Express is listening");
	});
});
