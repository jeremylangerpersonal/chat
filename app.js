var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var path = require('path');

// var mysql = require('mysql2');
// var connection = mysql.createConnection({ host: 'localhost', user: 'root', database: 'chat', password: ''});

// connection.query('SELECT * FROM users', function(err, rows) {
//   console.log(rows);
// });


 
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

var users = [];
var messages = [];



// Make sure the content loads in correctly
function handler (req, res) {

  var filePath = req.url;

  if (filePath == '/') {
    filePath = __dirname + '/index.html';
  } else {
    filePath = __dirname + req.url;
  }

  var extname = path.extname(filePath);
  var contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  // console.log("filePath: "+filePath);
  fs.exists(filePath, function(exists) {

    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
        }
        else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    }
    else {
      res.writeHead(404);
      res.end();
    }
  });
}

io.sockets.on('connection', function (socket) {

  // console.log(socket);
  console.log('connection was made.');
  users.push();
  socket.emit('getallmessages', messages);

  socket.on('message', function (message) {
    console.log(message);
    // Include message in server's data
    messages.push(message);
    // // Send message to everyone else
    // socket.broadcast.emit('displaymessage', message);
    // Send message to everyone including the sender to make it simpler
    io.sockets.emit('displaymessage', message);
  });

  // // Automatically run when player is disconnected
  // socket.on('disconnect', function() {
  //   socket.broadcast.emit('removeplayer', socket.clientname);
  // });
});

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});
process.on('exit', function(code) {
  console.log('About to exit with code: ', code);
});