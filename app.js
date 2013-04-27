// ========================
// ==== Express server ====
// ========================
var express = require("express");
// var app = express();
// app.listen(8889);

var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Groups = require('./Groups');



init();


// ========================
// === Socket.io server ===
// ========================

var io = require('socket.io').listen(8888);
io.sockets.on('connection', function(socket) {
    //initialize user's socket id into every group and the user's schema
    socket.on("init", function(data) {
        User.findOne({username: data.user}, function(err, user) {
            if (err) throw err;
            user.socketid = socket.id;
            user.save(function(err) {
                if (err) throw err;
            });
            var groups = user.groups.slice(0);
            addSocketToGroups(groups, data.user, socket.id, socket, function() {
                console.log("added socket to groups");
            }, function(err) {
                console.log("failed to add socket to groups coz:", err);
            });
            
        });

    });

    console.log("socket", socket.id);
    //socket.send(socket.id);
    socket.on("msg", function(data) {
        //store this chat message in the group collection
        storeMsgInGroup(data);
        socket.emit('status', {success: 'true'});
        console.log("Emitting!");
        socket.broadcast.to(data.grpID).emit('newmsg', data);
        //console.log("data.date", typeof(data.date));
        //console.log("new date", typeof(new Date()));
    });

    socket.on('disconnect', function() {

        console.log('socket disconnected');
    });
});


function storeMsgInGroup(data) {
    Groups.findOne({_id: data.grpID}, function(err, group) {
        if (err) throw err;

        //note: data = {body: input, date: date.toString(), grpID: chat.group._id, user: localStorage.user};
        group.chat.push(data);
        group.save(function(err) {
            if (err) throw err;
            console.log("stored message in the server");
        });
    });
}

function addSocketToGroups(groups, user, socketid, socket, onSuccess, onError) {
    if (groups.length === 0) {
        onSuccess();
        return;
    }
    var group = groups.shift();
    Groups.findOne({_id: group}, function(err, grp) {
        if (err) {
            onError(err);
            return;
        }
        //if (grp.clients === undefined) grp.clients = {};
        //if (grp.clients[user] === undefined) grp.clients[user] = {};
        //grp.clients.push({user: user, socket: socketid});
        for (var i = 0; i < grp.clients; i++) {
            if (grp.clients.user === user) {
                grp.clients.socket = socketid;
            }
        }
        //allow user to join all his/her groups (socket Room)
        var socketAlreadyThere = false;
        for (var j = 0; j < io.sockets.clients(group).length; j++) {
            console.log("ID of clients in group " + group + " =", io.sockets.clients(group)[j].id);
            if (io.sockets.clients(group)[j].id === socketid) {
                socketAlreadyThere = true;
            }
        }
        if (!socketAlreadyThere) {
            socket.join(group);
            console.log("socket " + socketid + " of username " + user + " is joining group " + group);
        }
            
        

        grp.save(function(err) {
            if (err) throw err;
            addSocketToGroups(groups, user, socketid, socket, onSuccess, onError);
        });
    })
}

function removeSocketFromGroups(groups, user, socketid, socket, onSuccess, onError) {
    if (groups.length === 0) {
        onSuccess();
        return;
    }
    var group = groups.shift();
    Groups.findOne({_id: group}, function(err, grp) {
        if (err) {
            onError(err);
            return;
        }
        //if (grp.clients === undefined) grp.clients = {};
        //if (grp.clients[user] === undefined) grp.clients[user] = {};
        //grp.clients.push({user: user, socket: socketid});
        for (var i = 0; i < grp.clients; i++) {
            if (grp.clients.user === user) {
                grp.clients.socket = socketid;
            }
        }
        //allow user to join all his/her groups (socket Room)
        socket.join(group);

        grp.save(function(err) {
            if (err) throw err;
            addSocketToGroups(groups, user, socketid, socket, onSuccess, onError);
        });
    })
}



// ========================
// === Mongoose server ===
// ========================




function init(){
    app = express();
    configureExpress(app);

    User = initPassportUser();
    //console.log("User", User);

    db = mongoose.connect('mongodb://localhost/caftcoj');
    //checkForAndCreateRootUser(User);

    require('./loginRoutes')(app);
    require('./appRoutes')(app);

    http.createServer(app).listen(3000, function() {
        console.log("Express server listening on port %d", 3000);
    });
    Groups.findOne({name: 'default'}, function(err, group) {
        console.log("GROUP", group);
        if (!group) {
            createGroup("default", [], function(id) {
            console.log("added default group to server! ID = ", id);
        }, function() {
            console.log("could not add default group to server");
        });
        }
    });

    User.find({}, function(err, user){
                //console.log("user in init:", user);
            });
    
    //console.log("Groups", Groups);
}

function createGroup(name, users, onSuccess, onError) {
    
    var defaultGroup = new Groups({name: name, users: users});
    defaultGroup.registeredTimestamp = new Date();
    //defaultGroup.clients = {};
    console.log("defaultGroup1", defaultGroup.clients);
    for (var i = 0; i < users.length; i++) {
        defaultGroup.clients.push({user: users[i], socket: "nothing"});
    }
    console.log("defaultGroup2", defaultGroup.clients);
    defaultGroup.save(function(err) {
        console.log("ID!!!!! ONE", defaultGroup._id);
        console.log("defaultGroup", defaultGroup);
        if (err) onError();
        else onSuccess(defaultGroup._id);

        Groups.find({}, function(err, doc) {
            if (err) throw err;
            console.log("this is her :",doc);

        });
        
    });
}


function configureExpress(app){
    app.configure(function(){
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'static')));
    });
}

function initPassportUser(){
    var User = require('./User');

    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    return User;
}

function checkForAndCreateRootUser(User){
    User.findOne({username : "root" }, function(err, existingUser) {
        if (err || existingUser) return;
        var user = new User({ username : "root" });
        user.superuser = true;
        user.registeredTimestamp = new Date();
        user.setPassword("SECRET", function(err) {
            if (err) return;
            user.save(function(err) { });
        });  
    });
}





function getClients() {
    var os = require('os')

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (k in interfaces) {
        for (k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family == 'IPv4' && !address.internal) {
                addresses.push(address.address)
            }
        }
    }

    //console.log("addresses: ", addresses);
}


app.get("/logout", function(request, response){
    User.findOne({current: true}, function(err, user) {
        if (err) response.send({'err': err, 'success': false});
        if (user) {
            user.current = false;
            user.save(function(err) {
                if (err) response.send({'error': err});
                response.send('success');
            });
        } else {
            console.log("this should not happen");
        }
    })
});

// get item
app.get("/getAllUsers", function(request, response){
    userArray1 = [];
    successful = true;
    Groups.find({name: "default"}, function(err, group) {
        if (err) {
            console.log("GROUP ERROR");
            //response.send({'error': err});
            successful = false;
        }
        if (group) {
            //console.log("group[0].users", group[0].users);
            var userArray = getUserArray(group[0].users, userArray1, response);
            //console.log("THISuserArray", userArray);
            
            }
    });
    //response.send({'success': true, 'userArray': userArray});

});
function getUserArray(usernameArray, userArray2, response) {
    userArray2 = userArray2;
    //console.log("usernameArray first", usernameArray);
    if (usernameArray.length === 0) {
        //console.log("userArray2", userArray2);
        response.send({'success': true, 'userArray': userArray2});
        return userArray2;
    }
    var userHead = usernameArray.shift();
    //console.log("userHead", userHead);
    User.findOne({username: userHead}, function(err, user) {
        if (err) console.log("USER ERROR");
        userArray2.push(user);
        getUserArray(usernameArray, userArray2, response);
    })
}




// get events in group
app.get("/getEvents", function(request, response){
    Groups.findOne({name: "default"}, function(err, group) {
        if (err) {
            console.log("GROUP ERROR");
            response.send({'error': err});
            //successful = false;
        }
        if (group) {
            //console.log("group[0].users", group[0].users);
            var events = group.events;
            response.send({'success': true, 'events': events});
            //console.log("THISuserArray", userArray);
            
            }
    });
    //response.send({'success': true, 'userArray': userArray});

});


app.get("/getUser", function(request, response) {
    User.findOne({current: true}, function(err, user) {
        if (err) {
            console.log("error 1");
            response.send({'err': err, 'success': false});
        } if (user) {
            console.log("username", user.username);
            response.send({'success': true, 'username': user.username});
        } else {
            console.log("error 2");
            response.send({'err': "error", 'success': false});
        }
    })
})

app.post("/newEvent", function(request, response) {
    //console.log("group name", request.body.group);
    Groups.findOne({name: request.body.group}, function(err, group) {
        if (err) response.send('error');
        if (group) {
            group.events.push({name: request.body.name,
                                start: request.body.start,
                                end: request.body.end,
                                date: request.body.date,
                                lat: request.body.lat, 
                                lon: request.body.lon,
                                created: request.body.created});
            group.save(function(err) {
                if (err) response.send({'error': err});
                response.send('success');
            });
            response.send('success');
        }
        Groups.find({}, function(err, group) {
            console.log("group", group);
        });
    })
    
  // response.send({ 
  //   event: event,
  //   success: successful
  // });
});

app.post("/addgroup", function(request, response) {
    createGroup(request.body.name, request.body.users, function(id) {
        console.log("ID!!!!! TWO", id);
        var a = request.body.users.slice(0);
        addGroupID(a, id, function() {
            response.send({'error': true});
        }, function() {
            response.send({'success': true});
            User.find({}, function(err, user){
                console.log("user after adding grp ID:", user);
            });
        });
    }, function() {
        response.send({'error': true});
    })
});

function addGroupID(users, id, onError, done) {
    if (users.length === 0) {
        done();
        return;
    }
    var user = users.shift();
    console.log("ID!!!!! THREE", id);
    User.findOne({username: user}, function(err, u) {
        if (err) {
            console.log("could not find user: ", user);
            onError();
            return;
        }
        console.log("u.groups", u.groups);
        u.groups.push(id);
        console.log("u.groups after", u.groups);
        u.save(function(error) {
            if (err) {
                console.log("could not save");
                onError();
                return;
            }
            addGroupID(users, id, onError, done);
        });
        
    });

}

app.post("/updateLocation", function(request, response) {
    successful = false;
    console.log("request.body.latitude", request.body.latitude);
    console.log("request.body.user", request.body.user);
        //User.findOne({username: request.body.user}, function(err, user) {
    User.findOne({username: request.body.user}, function(err, user) {
        if (err) response.send({'error': err,});
        //console.log("user", user);
        if (user) {
            user.lastLocation.lat = request.body.latitude;
            user.lastLocation.lon = request.body.longitude;
            user.save(function(err) {
                if (err) response.send({'error': err});
                response.send('success');
            });
            successful = true;
            //console.log("user", user);          
        } else {
            console.log("did not find user to update location");
        }

    });
    console.log(successful);
    if (successful === true) {
        console.log("updated");
        //response.send({'success': undefined});
    }

});

app.post("/getGroups", function(request, response) {
    User.findOne({username: request.body.user}, function(err, user) {
        if (err) {
            response.send({"error": "could not find user"});
            throw err;
        }
        var grpIDs = user.groups;
        var objArr = [];
        getGroupObjects(objArr, grpIDs, function(a) {
            response.send({"success": a});
        }, function() {
            response.send({"error": "could not get groups that user had in his groups array"});
        })
    });
}); 

function getGroupObjects(objArr, grpIDs, onSuccess, onError) {
    if (grpIDs.length === 0) {
        onSuccess(objArr);
        return;
    }
    var thisID = grpIDs.shift();
    Groups.findOne({_id: thisID}, function(err, group) {
        if (err) {
            onError();
            return;
        }
        if (!group) {
            onError();
            return;
        }
        objArr.push(group);
        getGroupObjects(objArr, grpIDs, onSuccess, onError);
    })
}

app.post("/getGroup", function(request, response) {
    Groups.findOne({_id: request.body.id}, function(err, group) {
        if (err) {
            response.send({"error": "could not find user"});
            throw err;
        }
        response.send({"success": true, "group": group});
    });
});

// update one item
app.put("/database/event", function(request, response){
  //edit item
  response.send({
    success: true
  });
});


// delete event
app.delete("/database/:user/:className", function(request, response){
  //delete it
  response.send({
    database: database,
    success: true
  });
});

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});





