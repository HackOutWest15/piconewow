var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var User = require('./schemas/user.js');
var Show = require('./schemas/show.js');


//Facebook code
var FacebookTokenStrategy = require('passport-facebook-token');
var FACEBOOK_APP_ID = '1638718853011507';
var FACEBOOK_APP_SECRET = '86468572aecca75ebcf8044581591bbd'; 

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://nextshow:ofartist@ds029575.mlab.com:29575/heroku_623zkvqk');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'piconepiconepicone',saveUninitialized:false,resave:false})); // session secret
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookTokenStrategy({
    clientID: "1638718853011507",
    clientSecret: "86468572aecca75ebcf8044581591bbd"
  },
  function(accessToken, refreshToken, profile, done) {
/*    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
        //find the user in the database based on their facebook id
    User.findOne( {  'facebook.id' : profile.id }, function(err, user) {
        
        // if there is an error, stop everything and that 
        // ie an error connecting to the database
        if (err)
            return done(err);  
        // if the user is found, then log htem in
        if (user) {
            return done(null, user); // user found, return that user
        } else {
            // if there is no user found with that facebook id, create them
            var newUser             = new User();
            // set all of the facebook information in our user model
            newUser.facebook.id     = profile.id; // set the users facebook id
            newUser.facebook.token  = accessToken; // we will save the token that facebook provides to the user
            newUser.facebook.name   = profile.displayName; // look at the passport user profle to see how names are returned
            newUser.facebook.email  = profile.emails[0].value;  // facebook can return multiple emails so w'll take the first
            Show.find({},function(err,shows){
                newUser.unseen = shows;
                // save the user to the database
                newUser.save(function(err) {
                    if (err)
                        return done(err);
                    //if successful, return the new user
                    return done(null, newUser);
                });
            });
        }
    });
  }
));

app.use('/', routes);
app.use('/users', users);
//app.use('/auth', facebook);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//clearDB();
//loadSchedule();
//syncShows();

//Clear DB script
function clearDB(){
    mongoose.connection.collections['users'].drop( function(err) {
      console.log('collection dropped');
    });
    mongoose.connection.collections['shows'].drop( function(err) {
      console.log('collection dropped');
    });
}
//schedule add script
function loadSchedule(){
    loadThursday();
    loadFriday();
    loadSaturday();
}
function syncShows(){
    Show.find({}, function(err, shows){
        User.find({},function(err,users){
            for(var u = 0; u<users.length;u++){
                users[u].unseen = updateUserList(users[u].unseen,shows);
                users[u].picked = updateUserList(users[u].picked,shows);
                users[u].skipped = updateUserList(users[u].skipped,shows);
                users[u].save(function(err,saved){console.log(err);});
            }
        });
    });
}

function pushArtistToUnseen(artistShowId){
    Show.find({showId: artistShowId}, function(err, shows){
        if(!err && shows.length>0){
            User.find({},function(err,users){
                for(var u = 0; u<users.length;u++){
                    users[u].unseen.push(shows[0]);
                    users[u].save(function(err,saved){console.log(err);});
                }
            });
        }
    });
};

function updateUserList(list,shows){
    for(var a = 0; a<list.length; a++){
        var listItem = list[a];
        for(s = 0; s<shows.length; s++) {
            if(shows[s].showId == listItem.showId) {
                listItem.startTime = shows[s].startTime;
                listItem.stage = shows[s].stage;
                listItem.day = shows[s].day;
                listItem.duration = shows[s].duration;
                listItem.artist = shows[s].artist;
                listItem.collisions = shows[s].collisions;
            }
        }
    }
    return list;
}

function loadThursday(){
    var thursday = require('./data/2016/thursday.js');
    for(var i = 0; i<thursday.length;i++){
        var showData = thursday[i];
        var show = new Show(showData);
        show.save(function(err, newShow){
            if (err) return console.error(err);
        });
    }
}
function loadFriday(){
    var friday = require('./data/2016/friday.js');
    for(var i = 0; i<friday.length;i++){
        var showData = friday[i];
        var show = new Show(showData);
        show.save(function(err, newShow){
            if (err) return console.error(err);
        });
    }
}
function loadSaturday(){
    var saturday = require('./data/2016/saturday.js');
    for(var i = 0; i<saturday.length;i++){
        var showData = saturday[i];
        var show = new Show(showData);
        show.save(function(err, newShow){
            if (err) return console.error(err);
        });
    }
}


module.exports = app;
