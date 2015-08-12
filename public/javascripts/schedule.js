// A $( document ).ready() block.
$( document ).ready(function() {
	renderDay(thursday,'thursday');
});
function renderDay(day,dayName){
	var schedule = $('#schedule');
	var menuStr = "#"+dayName;
	$('.active-menu-item').removeClass('active-menu-item');
	$(menuStr).addClass('active-menu-item');
	schedule.empty();
	for(var i = 0; i<day.length;i++){
		var show = day[i];
		var showWidth = 100;
		var showMargin = 0;
		if(show.collisionCount>0){
			showWidth = 50;
			if(show.stage=="LINNE"){
				showMargin = 50;
			}
		}
		var time = show.startTime.split('.');
		var showStartMin = 60*parseInt(time[0]) + parseInt(time[1]) - 750;
		var showTop = 2 * showStartMin;
		var showHTML = "<div class='show-div' style='width:"+showWidth+"%;margin-left:"+showMargin+"%;top:"+showTop+"px'><div id='schedule-text'>";
		if(show.friends.length>0){
			var friendsHTML = "<div class='friends-row-wrapper'><div id='friends-row'>"
			for(var f = 0;f<show.friends.length;f++){
				var url = "http://graph.facebook.com/" + show.friends[f].facebookId + "/picture?type=large";
				friendsHTML +="<div class='friend-circle' style='background-image:url("+url+")'></div>";
			}
			friendsHTML+="</div></div>";
			showHTML+=friendsHTML;
		}
		showHTML+="<h3>"+show.artist+"</h3><span>"+show.startTime+"</span><span class='stage-text'>"+show.stage+"</span></div></div>";
		schedule.append(showHTML);
	}
}