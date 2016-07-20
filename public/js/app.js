var socket = io();

socket.on('connect',function(){
	//console.log("connected via socket.io!!");
});

socket.on('giveTests',function(obj){
	var $selectSet = jQuery('#TestSet');
	
	var s=jQuery.parseJSON(obj.testsArray);
	jQuery.each(s,function(i,value){
		$selectSet.append("<option value='"+value.id+"'>" + value.qFileName + "</option>");
	});
	
});


function browseQuestions () {
	//console.log(jQuery('#colTests').val());

socket.emit('browseQuestions',{
	test: jQuery('#colTests').val()}
	);
}

socket.on('replyBrowseQuestions',function (obj) {
	var s=jQuery.parseJSON(obj.ts);
	
	var data = "<tr><th>ID</th><th>QuestionText</th></tr>";
	for (var i = s[0].length - 1; i >= 0; i--) {
		data = data + "<tr><td>"+s[0][i].id+"</td><td>"+s[0][i].qText+"</td></tr>";
	}
	$("#qTable").html(data);
});

$( window ).load(function() {
  
  
});

function showTestIf(){

var full_url = document.URL; // Get current url
 //console.log(full_url);
  
var currentTestNAME = full_url.split('id=')[1].split('#')[0];
currentTestNAME =(decodeURIComponent(currentTestNAME));
  
var email = $("#aUserEmail").val();
var schoolName = $('#aUserSchoolName').val();

	if(email!= "")
	{
		if(email!="up@s@n@"){

		localStorage.setItem('currentUser',JSON.stringify({
		  	"email":email,
		  	"scName" : schoolName,
		  	"file" :currentTestNAME
		  })
		);
		}
		 socket.emit('populateTest',currentTestNAME);
		 $("#startContent").toggle();
		 $("#aLogOff").toggle();
		 $("#TestSet").prop("disabled",true);
 		 $("#quesContent").toggle();
  		 $(".endTestBtn").toggle();
  		 $("#endTestContent").toggle(false);
	}
}

socket.on('giveTestSet',function(obj){
	
	//console.log(obj.ts);
	
	var s=jQuery.parseJSON(obj.ts);
	//console.log(s);
	setQuestionDiv(s[0],0)
	localStorage.setItem('dataset',obj.ts);
	localStorage.setItem("resultSet",[]);
	$("#resultTotal-end").text("0")
	var totalQuestions = jQuery.parseJSON(localStorage.getItem('dataset')).length;
	$("#resultTotal-ques").text(totalQuestions)
	
});

socket.on('giveMIS',function(obj){
	
	
	var s=jQuery.parseJSON(obj.ts);
	var data = "<tr><th>Email</th><th>schoolName</th><th>File</th><th>Score</th><th>Total</th></tr>";
	$("#misresult").empty();
	console.log(s[0].length);
	for (var i = s[0].length - 1; i >= 0; i--) {
		data = data + "<tr><td>"+s[0][i].userEmail + "</td><td>"+s[0][i].userSchoolName+"</td><td>"
		+s[0][i].userFileHit+"</td><td>"+s[0][i].score+"</td><td>"+s[0][i].total+"</td></tr>"
	};
	
	$("#misresult").append(data);
});

function getTests(){
	socket.emit('getTests');

}

socket.on('listTests',function(obj){
	
	var s=jQuery.parseJSON(obj.ts);
	//console.log(s[0]);
	var data = "";
	for (var i = s[0].length - 1; i >= 0; i--) {
		data = data + "<option>"+s[0][i].qFileName+"</option>";
	}
	$("#colTests").append(data);
});

socket.on('giveResultTotal',function(obj){
	
	//console.log(obj.ts);
	
	var s=jQuery.parseJSON(obj.resultTotal);
	//console.log(s);
	var currentUser = jQuery.parseJSON(localStorage.getItem('currentUser'));
	var t = $("#resultTotal-ques").text() ;
	socket.emit('logUser',{
		  	"email":currentUser.email,
		  	"scName" : currentUser.scName,
		  	"file" :currentUser.file,
		  	"score":s,
		  	"total": t
		  });
	$("#resultTotal-end").text(s);
	
	
});


function setQuestionDiv(s,index){

{
	var $QuestionWindow = jQuery('#QuestionWindow');
	var $Qp = jQuery('#OptionWindow');
	var $Qid = jQuery('#Qid');
	var $Sid = jQuery('#Sid');
	
	
	$QuestionWindow.find('p').text(s.qText);
	var opttions = s.optionSet;
	$Qp.empty();
	//console.log(s);
	jQuery.each(opttions,function(i,value){
		//console.log(s.id);
		$Qid.val(s.id);
		var url =  "/image?id="+$Qid.val();
		console.log(url);
		$Sid.val(index);
		$Qp.append('<input type="radio" id="answers" name="answers" value="'+value+'">'+value+'<br>');
		//document.getElementById("QuestionImage").style.backgroundImage = "url("+url+")";
		$("#QuestionImage").attr("src","");
		$("#QuestionImage").css('display','block');
		$("#QuestionImage").attr("src",url);
	});
}

}

$("#QuestionImage").error(function () { 
    $(this).hide(); 
});

function showNext(){
	var $Qid = jQuery('#Qid');
	var $Sid = jQuery('#Sid');
	var i = parseInt($Qid.val());
	var curr_index = parseInt($Sid.val());
	var answer = ($( "input:radio[name=answers]:checked").val());
	var resultSet= localStorage.getItem("resultSet");
	var avar = {};
	avar.qid = i;
	avar.answer = answer;
	//console.log(resultSet);
	if(!resultSet)
		resultSet =new Array();
	else
		resultSet= jQuery.parseJSON(resultSet);
	
	resultSet.push({"qid":i,"answer":answer});
	localStorage.setItem("resultSet",JSON.stringify(resultSet));

	var s = jQuery.parseJSON(localStorage.getItem('dataset'));
	var index = null;
	if(i>s.length)
		index = i-s.length;
	else
		index = i;
	
	if(curr_index+1 >= s.length){
		eraseTest();
	}
	else
	    setQuestionDiv(s[curr_index+1],curr_index+1);
	//console.log(i+1);
	//alert("hello");
}

function mis(){
	var month = jQuery('#month option:selected').val();
	var day = jQuery('#day').val();
	var year = jQuery('#year option:selected').val();
	var d = new Date(year,month,day);
	console.log(d);
	socket.emit('getMIS',d);
}

function eraseTest(){
	$("#TestSet").prop("disabled",false);
	localStorage.setItem('dataset',null);
	$("#endTestContent").toggle();
	$(".endTestBtn").toggle();
	 $("#quesContent").toggle();
	resultSet = jQuery.parseJSON(localStorage.getItem('resultSet'));
	socket.emit('resultMaker',resultSet);

}

function showPrev(eventInitiator){
	alert("Not valid");
}
function closeMe()
{
    alert("Thanks! Please close this window");
}




//Handles submitting a new message

// $selectSet.append("<option>" + value + "</option>");
		
// 	$selectSet.on('submit',function(event){
// 		event.preventDefault();



// 		socket.emit('message',{
// 			text: $selectSet.find('input[name=message]').val()
// 		});
// 		socket.emit('getTests');
// 		$selectSet.find('input[name=message]').val('');
// 	});
