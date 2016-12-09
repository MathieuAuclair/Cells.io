var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8080);
console.log("server is running on localhost \n:127.0.0.1:8080\n*\n*\n*")


app.get('/',function(request, response){
	response.sendFile(__dirname + '/index.html');
	
	
})