var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'Mathieu',
	password: 'Aucm12099709',
	database: 'CELLS_IO',
	port: 3306 
});


connection.connect();

var query = connection.query(
	'SELECT * FROM PLAYER' , function(err, result, fields)
	{
		if(err) throw err;
		console.log('result: ', result);
	}
);

connection.end();


