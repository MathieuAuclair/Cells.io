var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var port = (process.env.PORT || process.env.VCAP_APP_PORT || 8080);
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(port, function(){
	console.log("server is running on localhost:8080\n*\n*\n*")
});



app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	if (req.secure) {
		next();
	} 
	else {
		res.redirect('https://' + req.headers.host + req.url);
	}	
});

app.use(express.static(__dirname + "/public"));

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
		online--;
		console.log(" %s Connected with server", online);	
	});	
	
	//update client stat
	socket.on('update', function(object){ 
		var playerIndex = findPlayer(socket.id);
		if(isNaN(playerIndex)){
			socket.disconnect();
			online++;
		}
		else{
			cellList[playerIndex].cell = object;
			io.emit('update', cellList);
		}
	});
});

app.post("/kill", function(request, response){
	var object = request.body;
	console.log(object.id + " : was killed!");
	removePlayer(object.id);//need to add a checkup on server side to remove cheat method
	response.end();
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
			var food = new cells(5);
			var foodIdSocket = new player(food, (food.color+cellList.length)); //color reduce risk of non unique key (not important)
			cellList.push(foodIdSocket);
		}
	}
}, 5000);

