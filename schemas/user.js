var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Show = require('./show.js');

var userSchema = mongoose.Schema({
    username: {type: String},
    facebook            : {
        id              : String,
        token           : String,
        email           : String,
        name            : String
    },
    picked:[Show.schema],
    skipped:[Show.schema],
    unseen:[Show.schema]
});
userSchema.plugin(findOrCreate);
/*userSchema.statics.newUser = function(username, callback){
    var newUser = new User({ username: username});
    newUser.save(function(err, newUser){
        if (err) return console.error(err);
        callback.send(newUser);
    });
}*/
userSchema.statics.findAndModify = function (query, doc, callback) {
  return this.collection.findAndModify(query, [], doc, {}, callback);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.schema = userSchema;