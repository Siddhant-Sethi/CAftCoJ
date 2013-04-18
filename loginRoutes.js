var passport = require('passport');
var User = require('./User');
var mongoose = require('mongoose');
var Groups = require('./Groups');
var Groups = mongoose.model('Groups', Groups);

module.exports = function (app) {
    
    app.get('/', function (req, res) {
        if (req.user === undefined){
            res.sendfile('static/index.html');
        } else {
            res.sendfile('static/map.html');
        }
    });

    app.post('/register', function(req, res) {
        var username = req.body.username;
        //console.log("User", User);
        User.findOne({username : username }, function(err, existingUser) {
            if (err){
                return res.send({'err': err});
            }
            if (existingUser) {
                return res.send('user exists');
            }

            var user = new User({ username : req.body.username });
            user.registeredTimestamp = new Date();
            user.first = req.body.first;
            user.last = req.body.last;
            user.setPassword(req.body.password, function(err) {
                if (err) {
                    return res.send({'err': err});
                }

                user.save(function(err) {
                    if (err) {
                        return res.send({'err': err});
                    }
                    return res.send('success');
                });
            });  
        });
        //console.log("Groups", Groups);
        Groups.findOne({name: "default"}, function(err, defaultGroup) {
            if (err)
                throw error;
            if (defaultGroup)
                console.log("It found the default group, and is adding the new user to it");
                console.log("Before:", defaultGroup.users);
                defaultGroup["users"].push(username);
                console.log("After:", defaultGroup.users);
                defaultGroup.save(function(err) {
                    if (err) throw err;
                    console.log("no error");
                })
                Groups.find({name: "default"}, function(err, defaultG) {
                    if (err)
                        throw error;
                    if (defaultG)
                        console.log("Second Find:", defaultG);
                });
        });

        

    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        req.user.lastUserAgent = req.headers['user-agent'];
        req.user.lastIp = req.ip;
        req.user.lastHost = req.host;
        req.user.lastLoginTimestamp = new Date();
        req.user.save();
        return res.send('success');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
