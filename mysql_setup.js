
var http = require("http");
var mysql = require("mysql");
var queryResult;

var pool = mysql.createPool({
	host: 'localhost',
	user: 'Mathieu',
	password: 'Aucm12099709',
	database: 'CELLS_IO',
	port: 3306 
});

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
			queryResult = results[0];

			http.createServer(function(request, response){
			response.writeHead(200, {'Content-Type' : 'text/plain' });
			response.write("name is " + JSON.stringify(queryResult.NOM));
			response.end();
			}).listen(8080);
		}
	})
	conn.release();
});


