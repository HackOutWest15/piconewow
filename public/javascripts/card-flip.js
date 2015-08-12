$(document).ready(function () {
	$('.Wizard-box').fadeIn();
	$('.Wizard-box').on(clickOrTouch,function(evt){
      $(this).hide();
    });
	loadArtistData(0, function(){
		popShow();

/*		$(".flip-container").on(clickOrTouch,function(e) {
			$(".flipper").toggleClass("is-flipped");
		});*/
	});


});