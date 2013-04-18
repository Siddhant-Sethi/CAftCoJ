// ========================
// ==== Express server ====
// ========================
var express = require("express");
// var app = express();
// app.listen(8889);




// ========================
// === Socket.io server ===
// ========================

var io = require('socket.io').listen(8888);
io.sockets.on('connection', function(socket) {
    console.log("connected!");
    getClients();
	socket.on("msg", function(data) {
		socket.emit('status', {success: 'true'});
		io.sockets.emit('newmsg', {body: data.body});
	});
});

// ========================
// === Mongoose server ===
// ========================

var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

init();

function init(){
    app = express();
    configureExpress(app);

    var User = initPassportUser();
    //console.log("User", User);

    db = mongoose.connect('mongodb://localhost/caftcoj');
    //checkForAndCreateRootUser(User);

    require('./loginRoutes')(app);
    require('./appRoutes')(app);

    http.createServer(app).listen(3000, function() {
        console.log("Express server listening on port %d", 3000);
    });

    Groups = createGroup("default", []);
    //console.log("Groups", Groups);
}

function createGroup(name, users) {
    var Groups = require('./Groups');
    var defaultGroup = new Groups({name: name, users: users});
    defaultGroup.registeredTimestamp = new Date();
    defaultGroup.save(function(err) {
        if (err) throw err;
    });
    //Groups.insert(defaultGroup);
    
    Groups.findOne({}, function(err, doc) {
        if (err)
            throw err;
        console.log("this is her :",doc);
    });
    return Groups;

    // User.find().each(function(err, doc){
    //     console.log("users:", doc);
    // });
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




// var mongo = require('mongodb');
// var host = 'localhost';
// var port = mongo.Connection.DEFAULT_PORT;

// var optionsWithEnableWriteAccess = { w: 1 };
// var dbName = 'db';

// var client = new mongo.Db(
//     dbName,
//     new mongo.Server(host, port),
//     optionsWithEnableWriteAccess
// );

// function openDb(onDbOpen){
//     client.open(onDbReady);

//     function onDbReady(error){
//         if (error)
//             throw error;


//         client.collection('userCollection', onUserCollectionReady);
        
//     }

//     function onUserCollectionReady(error, userCollection){
//         if (error)
//             throw error;

//         onDbOpen(userCollection);
        
//         // client.userCollection.insert({w: 1});
//         // client.userCollection.find().each(function(err, result) {
//         //     if (error) throw error;
//         //     console.log("result", result);
//         // })
//     }
// }

// function closeDb(){
//     client.close();
// }

// function initServer() {
//     openDb(onDbOpen);

// }


// initServer();


// function onDbOpen(collection){
//     insertUserDocuments(collection, onUserDocumentsInserted);
// }

// function onUserDocumentsInserted(err, collection){
//     if (err)
//         throw err;
//     console.log('documents inserted!');
//     //console.log("client:", client);
//     collection.find().toArray(function(err, result) {
//             if (error) throw error;
//             console.log(result);
//         })
//     closeDb();
// }

// function insertUserDocuments(collection, done){

//     collection.insert({n: 1}, function(err){
//         console.log("hey");
//         done(err, collection);
//         console.log("after");
//         return;
//     });
// }





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

    console.log("addresses: ", addresses);
}




// get item
app.get("/database/:user", function(request, response){
    //request data
  response.send({
    profile: profile,
    success: (profile !== undefined)
  });
});

app.post("/newEvent", function(request, response) {
    Groups.findOne({__id: request.body.group}, function(err, group) {
        if (err) response.send('error');
        if (group) {
            group.events.push({name: request.body.name,
                                time: request.body.time});
            response.send('success');
        }
    })
  // response.send({ 
  //   event: event,
  //   success: successful
  // });
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


