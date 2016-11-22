
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var foodNumber = 10;
var myCellSpeed = 8;

function drawCells(object)
{
	ctx.beginPath();
	ctx.arc(object.x, object.y, object.radius, 0, 2*Math.PI);
	ctx.fillStyle = object.color;
	ctx.fill();
	ctx.stroke();
}

function cells(size) 
{
	this.x = canvas.width/2;
	this.y = canvas.width/2;
	this.radius = size;
	this.color = "rgb(0,0,100)";
}

//player cells
var myCell = new cells(30);
//food cells
var foodCells = [];
//init value for food cells
for (x = 0; x < foodNumber; x++)
	{
		respawnFood(x);
	}

function respawnFood(x)
{
		foodCells[x] = new cells(10);
		foodCells[x].x = Math.round(Math.random()*canvas.width);
		foodCells[x].y = Math.round(Math.random()*canvas.height);
		foodCells[x].color = "green";
}
	
//update function
var update = setInterval(function(){
	
	ctx.clearRect(0,0,canvas.width, canvas.height);//make sure you draw everything after this line
	
	for (x = 0; x < foodNumber; x++) //to have a fixed camera i move food
	{
		foodCells[x].x -= movementX*myCellSpeed;
		foodCells[x].y -= movementY*myCellSpeed;
		if(Math.abs(myCell.x-foodCells[x].x)<myCell.radius && Math.abs(myCell.y-foodCells[x].y)<myCell.radius)
		{
			respawnFood(x);
			myCell.radius += 1;
			myCellSpeed = myCellSpeed * 0.99;
		}
		drawCells(foodCells[x]);
	}

	drawCells(myCell);//need to draw player each frame since he's erase each frame
	
},16);//60frame per second

var movementY = 0;
var movementX = 0;

//mouse position detection
function mousePosition(e) {
	 var rect = canvas.getBoundingClientRect();
     var mouseX = e.clientX - rect.left;
     var mouseY = e.clientY - rect.top;
	 if(mouseX < canvas.width && mouseX > 0 && mouseY < canvas.height && mouseY > 0)
	 {	 
	 movementX = (mouseX-250)/canvas.width;
	 movementY = (mouseY-250)/canvas.height;
	 }
}



