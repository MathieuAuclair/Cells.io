//load these with npm manager before
var querystring = require('querystring');
var mysql = require("mysql");
var http = require("http");
var fs = require("fs");
var url = require("url");

var pool = mysql.createPool({ //giving program acces to database with info pool
	host: 'localhost',
	user: 'Mathieu',
	password: 'Aucm12099709',
	database: 'CELLS_IO',
	port: 3306 
});


//function that insert values in database with a different poolConnection
function insertNewPlayer(idPlayer, nomPlayer)
{
	pool.getConnection(function(error, conn){
		var newPlayer = { NOM: nomPlayer, PLAYER_ID: idPlayer , RADIUS: 8 , X: 50 , Y: 55};
		conn.query('INSERT INTO PLAYER SET ?', newPlayer, function(error,results){
		  if(error) 
			  throw error;
		  else
		  console.log('SUCESSFULL INSERT');
		});
	});
}

//modify the information
function UpdateInfo(id)
{
	pool.getConnection(function(error, conn){
		conn.query(
			"UPDATE PLAYER SET X = ? WHERE PLAYER_ID = ?",
			[95, id],
			function(error, results)
			{
				if(error)
					throw error
				else
					console.log("Update info : " + results.changedRows);
			}
		);
	});
}


// create server and load files
pool.getConnection(function(error, conn){//get acces to database
	var queryString = 'SELECT * FROM PLAYER'; //prepare mysql request
	conn.query(queryString, function (error,results) //inicialise connection to database
	{
		if(error)
		{
			throw error;
		}
		else
		{
			//console.log(results);
			
			http.createServer(function(request, response) //create a server to interact with server and client
			{
				if(request.url=='/index.html' || request.url=='/') 
				{
					
					fs.readFile("index.html",function (err, data){
						response.writeHead(200, {'Content-Type': "html",'Content-Length':data.length});
						response.write(data);
						console.log("GET / " + request.url);
						response.end();
					});
					//give a id to player
					var id = Math.round(Math.random()*999);
					//insertNewPlayer(id, "Mathieu");
					console.log("session id is : " + id);
				}
				
				//response.writeHead(200, {'Content-Type' : 'text/html' });
				//response.write("name is " + JSON.stringify(results[0].NOM)); 
			}).listen(8080);
			console.log(" * \n * \n Server is running on localhost \n : 127.0.0.1:8080 \n *"); //launch server display
		}
	});
	conn.release();
});


//load data
function loadInfo(id)
{
	pool.getConnection(function(error, conn)
	{//get acces to database
		var queryString = 'SELECT * FROM PLAYER WHERE PLAYER_ID = ' + id; //prepare mysql request
		conn.query(queryString, function (error,results) //inicialise connection to database
		{
			if(error)
			{
				throw error;
			}
			else
			{
				console.log("name is " + JSON.stringify(results[0].NOM));//display name
			}
		});
	});
}

