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

socket.on('giveResultTotal',function(obj){
	
	//console.log(obj.ts);
	
	var s=jQuery.parseJSON(obj.resultTotal);
	//console.log(s);
	var currentUser = jQuery.parseJSON(localStorage.getItem('currentUser'));
	socket.emit('logUser',{
		  	"email":currentUser.email,
		  	"scName" : currentUser.scName,
		  	"file" :currentUser.file,
		  	"score":s
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
		$Sid.val(index);
		$Qp.append('<input type="radio" id="answers" name="answers" value="'+value+'">'+value+'<br>');
	
	});
}

}

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