var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var connections = [];

server.listen(process.env.PORT || 8080);
console.log("server is running on localhost \n:127.0.0.1:8080\n*\n*\n*")


app.get('/',function(request, response){
	response.sendFile(__dirname + '/index.html');	
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log(" %s Connected with server", connections.length);
	
	
	//disconnect
	socket.on('disconnect', function(data){
	connections.splice(connections.indexOf(socket), 1);
	console.log(" %s Disconnected from server", connections.length);
	});
	
	var ClientData;	

	//recive data from client
	socket.on("sendData", function(data){
		console.log(data);
		ClientData = data;
		io.emit("new message", {msg: data});
	});
	
	//recive from client and send back
	socket.on('position change', function(msg){
		jsonMsg = JSON.stringify(msg)
		io.emit('position change', jsonMsg);
	});

	
});