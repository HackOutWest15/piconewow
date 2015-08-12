// A $( document ).ready() block.
$( document ).ready(function() {
	renderDay(thursday);
});
function renderDay(day){
	var schedule = $('#schedule');
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
		var showStartMin = 60*parseInt(time[0]) + parseInt(time[1]) - 800;
		var showTop = 2 * showStartMin;
		var showHTML = "<div class='show-div' style='width:"+showWidth+"%;margin-left:"+showMargin+"%;top:"+showTop+"px'><div id='schedule-text'><h3>"+show.artist+"</h3><span>"+show.startTime+"</span><span class='stage-text'>"+show.stage+"</span></div></div>";
		schedule.append(showHTML);
	}
}