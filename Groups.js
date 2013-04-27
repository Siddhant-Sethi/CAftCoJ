var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Groups = new Schema({
    name: String,
    users: Array,
    events: Array,
    chat: Array,
    clients: Array,
    registeredTimestamp: Date
});


module.exports = mongoose.model('Groups', Groups);
