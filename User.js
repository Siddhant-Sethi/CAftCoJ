var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    first: String,
    last: String,
    userID: String,
    registeredTimestamp: Date,
    lastLoginTimestamp: Date,
    lastLocation: {
    	lat: Number,
    	lon: Number
    },
    groups: Array,
    current: Boolean,
    socketid: String,
    //lastIp: String,
    //lastHost: String,
    //lastUserAgent: String,
    //lastMsgTimestamp: Date,
    //superuser: Boolean
});

User.plugin(passportLocalMongoose); //adds username, password to schema

module.exports = mongoose.model('User', User);
