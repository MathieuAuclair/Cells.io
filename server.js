var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8080);
console.log("server is running on localhost:8080\n*\n*\n*")


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

var cellList = []; //list of online player

function player(cell, id){ //object to store player
	this.id = id;
	this.cell = cell;
}

io.sockets.on('connection', function(socket){
		
	//call a new player
	socket.on("new player", function(object){
		cellList[cellList.length] = new player(object, socket.id);
	});

	//disconnect
	socket.on('disconnect', function(data){
	connections.splice(connections.indexOf(socket), 1);
	console.log(" %s Connected with server", connections.length);
	});	
	
	//update client stat
	socket.on('update', function(object){ 
		for(i = 0; i < cellList.length; i++){
				if(socket.id == cellList[i].id){
					cellList[index].cell = object;
					break;
				}
		}
		io.emit('update', cellList);
	});
});
