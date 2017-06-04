//connection with socket
			
var socket = io.connect();
				
//canvas game
		
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
			
function drawCells(object){
	ctx.beginPath();
	ctx.arc(object.x, object.y, object.radius, 0, 2*Math.PI);
	ctx.fillStyle = object.color;
	ctx.fill();
	ctx.stroke();
}

//player cells

var myCell;
var lastKilled; //last cells kill
var cellList = [];
socket.emit("newPlayer"); //send new player info to server
socket.on("newPlayer", function(playerCell){
	myCell = playerCell;
});
			
//update function

var update = setInterval(function(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	updateStatWithServer(myCell);//update cellList
	myCell.x += movementX*myCell.speed;
	myCell.y += movementY*myCell.speed;
	for (x = 0; x < cellList.length; x++){
		var cellToDraw = cellList[x].cell;
		checkForCellKill(cellList[x]);
		cellToDraw.x -= (myCell.x - canvas.width/2);  //this is to center our cell and
		cellToDraw.y -= (myCell.y - canvas.height/2); //set other cells relative to our cell
		drawCells(cellToDraw);
	}
},100); //  ~ 10 frame per second

function updateStatWithServer(object){
	socket.emit('update', object);
	socket.on('update', function(onlinePlayerList){
		cellList = onlinePlayerList;
	});
}

function checkForCellKill(cellSocket){
	var otherCell = cellSocket.cell;
	var distanceBetweenCells = Math.sqrt(Math.pow(otherCell.x - myCell.x, 2) + Math.pow(otherCell.y - myCell.y, 2));
	if(distanceBetweenCells < (myCell.radius) && myCell.radius > otherCell.radius){
		if(cellSocket.id != socket.id && cellSocket.id != lastKilled){
			lastKilled = cellSocket.id;
			killOtherCells(cellSocket);
		}
	}
}

function killOtherCells(cellSocket){
	myCell.radius += 1; //should be on server side!
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8080/kill", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(cellSocket));
}

//mouse position detection

var movementY = 0;
var movementX = 0;

function mousePosition(e) {
	var rect = canvas.getBoundingClientRect();
	var mouseX = e.clientX - rect.left;
	var mouseY = e.clientY - rect.top;
	if(mouseX < canvas.width && mouseX > 0 && mouseY < canvas.height && mouseY > 0){	 
		movementX = (mouseX-250)/canvas.width;
		movementY = (mouseY-250)/canvas.height;
	}
}

