    var artistBio = "Artist BIO: Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";
    var artistImgPath = "images/FirstAidKit_1.jpg";
    var clickOrTouch = (('ontouchend' in window)) ? 'touchend' : 'click';
    var seen= [];
function popShow(){
  if(unseen.length > 0){
    var show = unseen.shift();
    seen.push(show);
    var cards = [];
    console.log(show);
    cards.push(new Tindercardsjs.card(show.showId, show.showId, show.artist, show.stage, show.startTime, artistBio,artistImgPath));
    Tindercardsjs.render(cards, $('#Screen'), swipeCallback,animation);
    $(".flip-container").off(clickOrTouch);
    $(".flip-container").on(clickOrTouch,function(e) {
      $(".flipper").toggleClass("is-flipped");
    });
    if(show[0]){
      var img = new Image();
      img.src = 'https://image.tmdb.org/t/p/'+IMG_SIZE+movies[0].poster;
      images.push(img);
    }
  }
}


var lastswipe;

function swipeCallback(event){
  if(!lastswipe ||  new Date().getTime() - lastswipe > 500){
    lastswipe = new Date().getTime();
    var show = _.filter(seen,function(s){
    				return event.cardid == s.showId;
    			});
    if(String(event.direction) == 'left' ){
      // postToServer('/api/hateMovie',JSON.stringify({movieid:event.cardid}),function(data){
      //   handleNewMovies(data.movies);
      //});
    	console.log(show);
    	if(show.length > 0){
    		var jsonData = {show:JSON.stringify(show[0])};
	        $.post('/skip',jsonData,function(data){
				console.log('success');
	          }).error(function(err){
				console.log(err);
	        });
    	}
    }else if(String(event.direction) == 'right'){
    	if(show.length > 0){
    		var jsonData = {show:JSON.stringify(show[0])};
	        $.post('/like',jsonData,function(data){
				console.log('success');
	          }).error(function(err){
				console.log(err);
	        });
    	}
    }
    popShow();
  }
}

function animation(direction){
      console.log(direction);
  switch(direction){
    case "left":
        $("#feedback-no").show();
        $("#feedback-no").fadeTo(500,0);
        break;
    case "right":
        $("#feedback-yes").show();
        $("#feedback-yes").fadeTo(500,0);
    break;
  }
}