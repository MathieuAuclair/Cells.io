
var http = require("http");
var mysql = require("mysql");


var pool = mysql.createPool({
	host: 'localhost',
	user: 'Mathieu',
	password: 'Aucm12099709',
	database: 'CELLS_IO',
	port: 3306 
});


//trying to insert values

pool.getConnection(function(error, conn){
	var newPlayer = { NOM: 'Winnie', PLAYER_ID: 1 , RADIUS: 8 , X: 50 , Y: 55};
	conn.query('INSERT INTO PLAYER SET ?', newPlayer, function(error,results){
	  if(error) 
		  throw error;
	  else
	  console.log('SUCESSFULL INSERT');
	});
});

//modify the information

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

// reading information from database

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
			console.log(results);

			http.createServer(function(request, response){
			response.writeHead(200, {'Content-Type' : 'text/plain' });
			response.write("name is " + JSON.stringify(results[0].NOM));
			response.end();
			}).listen(8080);
		}
	});
	conn.release();
});
