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
	socket.on("newPlayer", function(object){
		console.log("new player has been created!");
		cellList[cellList.length] = new player(object, socket.id);
		console.log(" %s Connected with server", cellList.length);
		io.emit("newPlayer");
	});

	//disconnect
	socket.on('disconnect', function(data){
		removePlayer(socket.id);
		console.log(" %s Connected with server", cellList.length);	
	});	
	
	//update client stat
	socket.on('update', function(object){ 
		var playerIndex = findPlayer(socket.id);
		if(playerIndex != null){
			cellList[findPlayer(socket.id)].cell = object;
			io.emit('update', cellList);
		}
	});
});

function removePlayer(id){
	try{
		cellList.splice(findPlayer(id), 1);
	}
	catch(err){
		console.log(err);
	}
}

function findPlayer(player){
	for(i=0; i<cellList.length; i++){
		if(cellList[i].id == player){
			return i;
		}
	}
	console.log("error player not found...");
}

