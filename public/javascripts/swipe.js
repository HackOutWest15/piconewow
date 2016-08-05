    //var artistBio = "Artist BIO: Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";
    //var artistImgPath = "images/FirstAidKit_1.jpg";
    var clickOrTouch = (('ontouchend' in window)) ? 'touchend' : 'click';
    var seen= [];
function popShow(){
  if(unseen.length > 0){
    var show = unseen.shift();
    seen.push(show);
    var cards = [];
    cards.push(new Tindercardsjs.card(show.showId, show.showId, show.artist, show.day, show.stage, show.startTime, show.artistBio,show.artistImgPath, show.friends));
    Tindercardsjs.render(cards, $('#Screen'), swipeCallback,animation);
    $(".flip-container").off(clickOrTouch);
    $(".flip-container").on(clickOrTouch,function(e) {
      $(".flipper").toggleClass("is-flipped");
    });
    $("#button-play").on('click',playBtnClick);
    $("#button-card-schedule").on('click',goToSchedule);
    $("#button-card-maybe").on('click',maybeClick);
    if(show[0]){
      var img = new Image();
      img.src = 'https://image.tmdb.org/t/p/'+IMG_SIZE+movies[0].poster;
      images.push(img);
    }
  }else{
    $('Wizard-box').hide();
    $('Finished-swiping-box').fadeIn();
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
    	if(show.length > 0){
        show[0].friends = [];
    		var jsonData = {show:JSON.stringify(show[0])};
	        $.post('/skip',jsonData,function(data){
				console.log('success');
	          }).error(function(err){
				console.log(err);
	        });
    	}
    }else if(String(event.direction) == 'right'){
    	if(show.length > 0){
        show[0].friends = [];
    		var jsonData = {show:JSON.stringify(show[0])};
	        $.post('/like',jsonData,function(data){
				console.log('success');
	          }).error(function(err){
				console.log(err);
	        });
    	}
    }
    if(unseen.length>0){
      seen[seen.length-1].audio.pause();
      if(unseen[0] &&!unseen[0].audio){
  			loadArtistData(0,function(){
          popShow();
        });
  		}else{
        popShow();
      }
    }else{
      console.log('finished swiping');
      $('.Finished-swiping-box').fadeIn();
    }
  }
}

function animation(direction){
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
function playBtnClick(event){
  $(".play-btn").text(' ■');
  var playBtn = $("#button-play");
  playBtn.off('click');
  playBtn.on('click',stopBtnClick);
  seen[seen.length-1].audio.play();
  event.stopImmediatePropagation()
}
function stopBtnClick(event){
  $(".play-btn").text(' ►');
  var playBtn = $("#button-play");
  playBtn.off('click');
  playBtn.on('click',playBtnClick);
  seen[seen.length-1].audio.pause();
  event.stopImmediatePropagation()
}
function goToSchedule(event){
  event.stopImmediatePropagation()
  window.location.href = '/schedule';
}
function maybeClick(cardid){
  var show = _.filter(seen,function(s){
    return cardid == s.showId;
  });
  if(show.length > 0){
    seen[seen.length-1].audio.pause();
    unseen.push(show[0]);
    if(unseen[0] &&!unseen[0].audio){
      loadArtistData(0,function(){
        popShow();
      });
    }else{
      popShow();
    }
  }
}