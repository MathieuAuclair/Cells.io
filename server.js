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

var cellList = []; //list of player we send to client so he can see everyone
function player(cell, id){ //constructor to keep track of different cells in cellList
	this.id = id;
	this.cell = cell;
}

io.sockets.on('connection', function(socket){
	//connection
	connections.push(socket);
	console.log(" %s Connected with server", connections.length);
	
	//disconnect
	socket.on('disconnect', function(data){
	connections.splice(connections.indexOf(socket), 1);
	console.log(" %s Connected with server", connections.length);
	});	
	
	//recive from client and send back
	socket.on('update', function(object){
		var index = 0; //used to find the position of client cell
		for(i = 0; socket.id != cellList[i].id; i++)
			{
				index = i;
			}
		//console.log(index + " : " + JSON.stringify(cellList[index]));//keep it in case!
		JSON.stringify(cellList[index]).cell = object;//had a few issue so instanciate a new object was easier
		io.emit('update', cellList);//security leak, but i just want it to work so... no big deal!
	});
	
	//call a new player
	socket.on("new player", function(object){
		cellList[cellList.length] = new player(object, socket.id);
	});
});