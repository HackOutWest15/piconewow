$(document).ready(function () {
	loadArtistData(0, function(){
		popShow();
		$(".flip-container").click(function(e) {
			$(".flipper").toggleClass("is-flipped");
		});
	});
	for(var i = 0; i < 5; i++){

	}

});