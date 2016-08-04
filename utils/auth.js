var User = require("../schemas/user.js");

var auth = {};
auth.loggedIn = function loggedIn(req, res, next) {
    if (req.user) {
        next();
    }else {
        if(req.path!='/')
            res.redirect('/');
        else{
            next();
        }
    }
}
//auth.loggedIn = loggedIn;
module.exports = auth;