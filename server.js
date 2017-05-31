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

var cellList = []; //list of all cells with thiers ID
var online = 0; //count of online user

function player(cell, id){ //object to store player
	this.id = id;
	this.cell = cell;
}

//player object

function cells(size){
	this.x = Math.random()*2000;
	this.y = Math.random()*2000;
	this.radius = size;
	this.color = getRandomColor();
	this.speed = 15;
}

//function that give random color

function getRandomColor(){
	switch(Math.floor(Math.random()*5)){
		case 0:
			return "blue";
			break;
		case 1:
			return "red";
			break;
		case 2:
			return "green";
			break;
		case 3:
			return "orange";
			break;
		default:
			return "gray";
			break;
	}
}

io.sockets.on('connection', function(socket){
		
	//call a new player
	socket.on("newPlayer", function(){
		var cell = new cells(15);
		cellList[cellList.length] = new player(cell, socket.id);
		online++;
		console.log(" %s Connected with server", online);
		io.emit("newPlayer", cell);
	});

	//disconnect
	socket.on('disconnect', function(data){
		removePlayer(socket.id);
		online++;
		console.log(" %s Connected with server", online);	
	});	
	
	//update client stat
	socket.on('update', function(object){ 
		var playerIndex = findPlayer(socket.id);
		if(isNaN(playerIndex)){
			socket.disconnect();
			online--;
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

var foodGenerator = setInterval(function(){
	if(cellList.length < 500){
		console.log("food generator activated!");
		for(i = cellList.length; i < 550; i++){
			cellList.push(new player(new cells(5), 0));
		}
	}
}, 5000);
