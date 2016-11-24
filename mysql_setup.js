


var mysql = require('mysql');

var pool = mysql.createPool({
	host: 'localhost',
	user: 'Mathieu',
	password: 'Aucm12099709',
	database: 'CELLS_IO',
	port: 3306 
});

pool.getConnection(function(error, conn){
	var queryString = 'SELECT NOM FROM PLAYER';
	conn.query(queryString, function (error,results)
	{
		if(error)
		{
			throw error;
		}
		else
		{
			console.log(results)
		}
	})
	conn.release();
});


