$(document).ready(function () {
	$('.Wizard-box').fadeIn();
	$('.Wizard-box').on(clickOrTouch,function(evt){
      $(this).hide();
    });
	var preloadCount = 0;
	for(var i = 0;i<5;i++){
		if(!unseen[i].audio){
			loadArtistData(i,function(){
				if(preloadCount>3){
					popShow();
				}else{
					preloadCount++;
				}
			});
		}
	}


});