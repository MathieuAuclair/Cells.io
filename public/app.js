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

function cells(size){
	this.x = canvas.width/2;
	this.y = canvas.width/2;
	this.radius = size;
	this.color = "blue";
	this.speed = 0.7;
}

//player cells

var cellList = [];
var myCell = new cells(30);
socket.emit("newPlayer", myCell); //send new player info to server
socket.on("newPlayer", function(err){});
			
//update function

var update = setInterval(function(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	updateStatWithServer(myCell);//update cellList
	myCell.x += movementX*myCell.speed;
	myCell.y += movementY*myCell.speed;
	for (x = 0; x < cellList.length; x++){
		var cellToDraw = cellList[x].cell;
		cellToDraw.x -= (myCell.x - canvas.width/2);  //this is to center our cell and
		cellToDraw.y -= (myCell.y - canvas.height/2); //set other cells relative to our cell
		drawCells(cellToDraw);
	}
},16);//60frame per second

function updateStatWithServer(object){
	socket.emit('update', object);
	socket.on('update', function(onlinePlayerList){
		cellList = onlinePlayerList;
	});
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

