var querystring = require('querystring');
var mysql = require("mysql");
var http = require("http");
var fs = require("fs");

var pool = mysql.createPool({
	host: 'localhost',
	user: 'Mathieu',
	password: 'Aucm12099709',
	database: 'CELLS_IO',
	port: 3306 
});


//insert values
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
/*
pool.getConnection(function(error, conn){
	conn.query(
		"UPDATE PLAYER SET X = ? WHERE PLAYER_ID = ?",
		[95, 1],
		function(error, results)
		{
			if(error)
				throw error
			else
				console.log("Update info : " + results.changedRows);
		}
	);
});
*/


// create server and load files
pool.getConnection(function(error, conn){
	var queryString = 'SELECT * FROM PLAYER';
	conn.query(queryString, function (error,results)
	{
		if(error)
		{
			throw error;
		}
		else
		{
			//console.log(results);
			
			http.createServer(function(request, response)
			{
			var idAttributed = true;	
				
				function get(fileType, nameFile){ 
					fs.readFile(nameFile,function (err, data){
						response.writeHead(200, {'Content-Type': fileType,'Content-Length':data.length});
						response.write(data);
						console.log("GET / " + nameFile);
						response.end();
					});
				}
				
				get("html","index.html");
				
				//giving a random id
				if(idAttributed)
				{
					var id = Math.round(Math.random()*999);
					insertNewPlayer(id, "Mathieu");
					console.log("session id is : " + id);
					idAttributed = false;
				}
				
				
				//response.writeHead(200, {'Content-Type' : 'text/html' });
				//response.write("name is " + JSON.stringify(results[0].NOM)); 
			}).listen(8080);
			console.log(" * \n * \n Server is running on localhost \n : 127.0.0.1:8080 \n *"); //launch server display
		}
	});
	conn.release();
});
