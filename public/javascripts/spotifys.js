
function loadArtistData(index,callback){
	var artist = unseen[index].artist;
	var showId = unseen[index].showId;
	var callbackCount = 0;
	$.ajax({
		url: "https://api.spotify.com/v1/search",
		data: {
		  q: artist,
		  type:"track"
		},
		success:function(data){
			var audio = new Audio();
		  	audio.src = data.tracks.items[0].preview_url;
		  	unseen[index].audio = audio;
		  	if(callbackCount>0){
		  		callback();
		  	}else{
		  		callbackCount++;
		  	}
		}
	});
	$.ajax({
		url: "https://api.spotify.com/v1/search",
		data: {
			q: artist,
			type:"artist"
		},
		success:function(data){
			var img = new Image();
			img.src=data.artists.items[0].images[1].url;
			unseen[index].artistImgPath = data.artists.items[0].images[0].url;
			var artistId = data.artists.items[0].id;
			var artistName = data.artists.items[0].name;
			var artistName = artistName.replace(' ','+');
			$.ajax({
				url:'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+artistName+'&api_key=0cc924cd3a50a215d375c61602af1a4b&format=json',
				//url: "http://developer.echonest.com/api/v4/artist/biographies?api_key=BKTYVQYVRUPS203VV&id=spotify:artist:"+artistId+"&format=json&results=1&start=0&license=cc-by-sa",
				success:function(d){
					if(d.artist && d.artist.bio){
						unseen[index].artistBio = d.artist.bio.summary;
					}
					if(callbackCount>0){
				  		callback();
				  	}else{
				  		callbackCount++;
				  	}
		
				}
			});

		}
	});
}

function fetchArtistData(show,callback){
	var artist = show.artist;
	var showId = show.showId;
	var callbackCount = 0;
	$.ajax({
		url: "https://api.spotify.com/v1/search",
		data: {
		  q: artist,
		  type:"track"
		},
		success:function(data){
			var audio = new Audio();
		  	audio.src = data.tracks.items[0].preview_url;
		  	show.audio = audio;
		  	if(callbackCount>0){
		  		callback();
		  	}else{
		  		callbackCount++;
		  	}
		}
	});
	$.ajax({
		url: "https://api.spotify.com/v1/search",
		data: {
			q: artist,
			type:"artist"
		},
		success:function(data){
			var img = new Image();
			img.src=data.artists.items[0].images[1].url;
			show.artistImgPath = data.artists.items[0].images[0].url;
			var artistName = data.artists.items[0].name;
			var artistName = artistName.replace(' ','+');
			$.ajax({
				url:'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+artistName+'&api_key=0cc924cd3a50a215d375c61602af1a4b&format=json',
				success:function(d){
					if(d.artist && d.artist.bio){
						show.artistBio = d.artist.bio.summary;
					}
					if(callbackCount>0){
				  		callback(show);
				  	}else{
				  		callbackCount++;
				  	}
		
				}
			});

		}
	});
}