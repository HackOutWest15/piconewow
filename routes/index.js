var express = require('express');
var router = express.Router();
var User 	= require('../schemas/user.js'); 
var passport = require('passport');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/facebook',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user
    console.log(req.user);
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
    var picked = user.picked;
    for (var s = 0; s<picked.length;s++){
      var show = picked[s];
      picked[s].collisionCount = 0;
      for(var c = 0; c<show.collisions.length;c++){
        var collision = show.collisions[c];
        for(var p = 0; p<picked.length;p++){
          var possibleCollision = picked[p];
          if(possibleCollision.showId==collision){
            picked[s].collisionCount +=1;
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
