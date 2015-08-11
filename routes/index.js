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

module.exports = router;
