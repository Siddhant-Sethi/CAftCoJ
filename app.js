// ========================
// ==== Express server ====
// ========================
var express = require("express");
var app = express();
app.get("/static/:staticFilename", function (request, response) {
  response.sendfile("static/" + request.params.staticFilename);
});
app.listen(8889);


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
// === Mongodb server ===
// ========================

var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;

var optionsWithEnableWriteAccess = { w: 1 };
var dbName = 'caftcojdb';

var client = new mongo.Db(
    dbName,
    new mongo.Server(host, port),
    optionsWithEnableWriteAccess
);

function openDb(onDbOpen){

    client.open(onDbReady);

    function onDbReady(error){
        if (error)
            throw error;
        client.collection('userCollection', onUserCollectionReady);
    }

    function onUserCollectionReady(error, userCollection){
        if (error)
            throw error;
        onDbOpen(userCollection);

    }
}

function closeDb(){
    client.close();
}

openDb(onDbOpen);

function onDbOpen(collection){
    insertUserDocuments(collection, onUserDocumentsInserted);
}

function onUserDocumentsInserted(err){
    if (err)
        throw err;
    console.log('documents inserted!');
    closeDb();
}

function insertUserDocuments(collection, docs, done){
    if (docs.length === 0){
        done(null);
        return;
    }
    var docHead = docs.shift(); //shift removes first element from docs
    collection.insert(docHead, function onInserted(err){
        if (err){
            done(err);
            return;
        }
        insertUserDocuments(collection, docs, done);
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

    console.log("addresses: ", addresses);
}




