function popMovie(){
  if(movies.length > 0){
    var movie = movies.shift();
    var cards = [];
    console.log(movie);
    cards.push(new Tindercardsjs.card(movie.id, movie.title, movie.genres,movie.rating,
        movie.runtime,movie.release,movie.description,movie.poster,movie.trailer,movie.actors));
    Tindercardsjs.render(cards, $('#Screen'), swipeCallback,animation);
    $(".flip-container").off(clickOrTouch);
    $(".flip-container").on(clickOrTouch,function(e) {
      $(".flipper").toggleClass("is-flipped");
    });
    if(movies[0]){
      var img = new Image();
      img.src = 'https://image.tmdb.org/t/p/'+IMG_SIZE+movies[0].poster;
      images.push(img);
    }
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