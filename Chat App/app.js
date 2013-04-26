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
	socket.on("msg", function(data) {
		socket.emit('status', {success: 'true'});
        socket.broadcast.emit('newmsg', data);
        console.log("data.date", typeof(data.date));
        console.log("new date", typeof(new Date()));
	});
});

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

console.log(addresses)



