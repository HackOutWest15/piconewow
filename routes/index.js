var express = require('express');
var router = express.Router();
var User 	= require('../schemas/user.js'); 
var passport = require('passport');

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
  res.render('picTest',{unseen:JSON.stringify(req.user.unseen)});
});
//SCHEDULE SCREEN
router.get('/schedule',function(req,res){
  //TODO
  res.render('schedule',{});
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
