$(document).ready(function () {
	$('.Wizard-box').fadeIn();
	$('.Wizard-box').on(clickOrTouch,function(evt){
      $(this).hide();
    });
	var preloadCount = 0;
	for(var i = 0;i<5;i++){
		if(unseen[i] && !unseen[i].audio){
			loadArtistData(i,function(){
				console.log('pre count: ',preloadCount);
				console.log('u length: ',unseen.length);
				if(preloadCount>3 || preloadCount>unseen.length-2){
					popShow();
				}else{
					preloadCount++;
				}
			});
		}
	}


});