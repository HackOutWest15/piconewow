var arr = ["AMANDA BERGMAN","ANDERSON PAAK","ANE BRUN","ANNA VON HAUSSWOLFF","ANOHNI","AURORA","BETH ORTON","CHELSEA WOLFE","CHVRCHES","DANIEL NORGREN","DAUGHTER","DEPORTEES","DESCENDENTS","EAGLES OF DEATH METAL","G-EAZY","GRACE JONES","HURULA","JACK GARRATT","JAMES BAY","JAMIE XX","JASON ISBELL","JOSE GONZALEZ","JULIA HOLTER KAMASI WASHINGTON","KAYTRANADA","LAURA MVULA","M83","MASSIVE ATTACK","MORRISSEY","PJ HARVEY","SEINABO SEY","SIA","SKEPTA","STORMZY","THE KILLS","THE LAST SHADOW PUPPETS","THE LIBERTINES","THE TALLEST MAN ON EARTH","TRAVI$ SCOTT","YUNG LEAN","ZARA LARSSON"];
var d = ["T","F","S","T","F","F","S","T","T","S","T","S","S","S","F","F","F","S","F","S","T","F","F","T","T","T","S","T","F","S","S","S","S","F","T","T","F","S","F","F"]

var m = [];
for (var i = 0; i<arr.length; i++) {
	m.push({a:arr[i],s:d[i]});
}
var done = m.map(function(item){
var day;
switch(item.s){
case "F":
day = "FRIDAY"
break;
case "T":
day = "THURSDAY"
break;
case "S":
day = "SATURDAY"
break;
}
return { artist: item.a, day:day, duration:60}
})

var th = done.filter(function(i){
	return i.day === "THURSDAY";
});
for(var t = 0; t<th.length;t++){
	if(t<10)
		th[t].showId = 1 + "0" + t;
	else
		th[t].showId = 1 + "" + t;
}

var fr = done.filter(function(i){
	return i.day === "FRIDAY";
});
for(var t = 0; t<fr.length;t++){
	if(t<10)
		fr[t].showId = 2 + "0" + t;
	else
		fr[t].showId = 2 + "" + t;
}
var sa = done.filter(function(i){
	return i.day === "SATURDAY";
});
for(var t = 0; t<sa.length;t++){
	if(t<10)
		sa[t].showId = 3 + "0" + t;
	else
		sa[t].showId = 3 + "" + t;
}
console.log(done);