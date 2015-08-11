var express = require('express');
var router = express.Router();
var User 	= require('../schemas/user.js'); 
var passport = require('passport');
var _ = require('underscore');
var fbgraph = require('fbgraphapi');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/facebook',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user
    res.send(req.user);
  }
);
//MAIN SWIPING SCREEN
router.get('/pic',function(req,res){
  res.render('pic',{unseen:JSON.stringify(req.user.unseen)});
});
//SCHEDULE SCREEN
router.get('/schedule',function(req,res){
  User.findById(req.user._id,function(err,user){
    var fb = new fbgraph.Facebook(req.user.facebook.token, 'v2.2');
  	fb.my.friends(function(err, me) {
      	console.log("friends",_.pluck(me.data,'id'));
        var friends = _.pluck(me.data,'id');
        User.find({"facebook.id":{$in:friends}},function(err,users){
          var picked = user.picked;
          for (var s = 0; s<picked.length;s++){
            var show = picked[s];
            //set collisions
            picked[s].collisionCount = 0;
            picked[s].friends = [];
            for(var c = 0; c<show.collisions.length;c++){
              var collision = show.collisions[c];
              for(var p = 0; p<picked.length;p++){
                var possibleCollision = picked[p];
                if(possibleCollision.showId==collision){
                  picked[s].collisionCount +=1;
                }
              }
            }
            //set friends
            for(var f = 0;f<users.length;f++){
              var friend = users[f];
              for(var fp = 0; fp<friend.picked.length;fp++){
                console.log('friend.picked',friend.picked);
                console.log('show.showId',show.showId);
                if(friend.picked[fp].showId==show.showId){
                  console.log('pushing friend');
                  picked[s].friends.push({facebookId:friend.facebook.id,name:friend.facebook.name});
                }
              }
            }
          }   
          var thursday = _.filter(picked,function(show){
            return show.day == "THURSDAY"
          });
          var friday = _.filter(picked,function(show){
            return show.day == "FRIDAY"
          });
          var saturday = _.filter(picked,function(show){
            return show.day == "SATURDAY"
          });
          res.render('schedule',{
            thursday:JSON.stringify(thursday),
            friday:JSON.stringify(friday),
            saturday:JSON.stringify(saturday),
          });
        });
  	});
  });
});

//LIKE FUNC
router.post('/like',function(req,res){
  var show = req.body.show;
  show = JSON.parse(show);
  if(show){
      User.findByIdAndUpdate(req.user._id,{
  		$push:{picked:show},
  		$pull:{unseen:show}
  	},function(err,user){
  		if(err){
  		    console.log(err);
          res.status(400).send("mongo error")
  		}
  		else{
        res.status(200).send({});
  		}
  	});
  }else{
    res.status(400).send("no show");
  }
});

//SKIP FUNC
router.post('/skip',function(req,res){
  var show = req.body.show;
  show = JSON.parse(show);
  if(show){
      User.findByIdAndUpdate(req.user._id,{
  		$push:{skipped:show},
  		$pull:{unseen:show}
  	},function(err,user){
  		if(err){
  		    console.log(err);
          res.status(400).send("mongo error")
  		}
  		else{
        res.status(200).send({});
  		}
  	});
  }else{
    res.status(400).send("no show");
  }
});


module.exports = router;
