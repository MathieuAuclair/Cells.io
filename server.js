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

//player object

function cells(size){
	this.x = 0;
	this.y = 0;
	this.radius = size;
	this.color = "blue";
	this.speed = 15;
}


io.sockets.on('connection', function(socket){
		
	//call a new player
	socket.on("newPlayer", function(){
		var cell = new cells(15);
		cellList[cellList.length] = new player(cell, socket.id);
		console.log(" %s Connected with server", cellList.length);
		io.emit("newPlayer", cell);
	});

	//disconnect
	socket.on('disconnect', function(data){
		removePlayer(socket.id);
		console.log(" %s Connected with server", cellList.length);	
	});	
	
	//update client stat
	socket.on('update', function(object){ 
		var playerIndex = findPlayer(socket.id);
		if(isNaN(playerIndex)){
			socket.disconnect();
		}
		else{
			cellList[playerIndex].cell = object;
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
	console.log("there was a problem with a user...");
}

