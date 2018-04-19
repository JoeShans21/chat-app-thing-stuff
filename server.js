var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'sql9.freemysqlhosting.net',
  user: 'sql9233631',
  password: 'nBNPW6SRwc',
  database: 'sql9233631'
});


app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));


io.on('connection', function(client) {
	connection.query('SELECT * FROM messages WHERE id=1', function(err, rows){
		console.log("here are dah rows");
		console.log(rows[0]);
	});
	console.log('Client connected...');
	client.on('join', function(data) {
		console.log(data);
	});

	client.on('messages', function(data, user){
		connection.query('INSERT INTO messages (content,author) VALUES ("'+data+'", "'+user+'");');
		client.emit('thread', data, user);
		client.broadcast.emit('thread', data, user);
	});
});

server.listen(process.env.PORT || 3000);
