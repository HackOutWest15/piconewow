var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var showSchema = mongoose.Schema({
        showId: String,
        artist: String,
        day: String,
        startTime: String,
        stopTime: String,
        duration: Number,
        stage: String,
        collisions: [Number],
        collisionCount:Number
});
showSchema.plugin(findOrCreate);
/*userSchema.statics.newUser = function(username, callback){
    var newUser = new User({ username: username});
    newUser.save(function(err, newUser){
        if (err) return console.error(err);
        callback.send(newUser);
    });
}*/
showSchema.statics.findAndModify = function (query, doc, callback) {
  return this.collection.findAndModify(query, [], doc, {}, callback);
};

var Show = mongoose.model('Show', showSchema);

module.exports = Show;
module.exports.schema = showSchema;