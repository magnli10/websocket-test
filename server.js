const http = require('http');
var WebSocketServer = require('websocket').server;
var fileSystem = require('fs'),
    path = require('path');


const server = http.createServer(function(request, response) {
    var filePath = path.join(__dirname, 'index.html');
    var stat = fileSystem.statSync(filePath);

    response.writeHead(200, {
       'Content-Type': 'text/html; charset=utf-8',
       'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(response);

});

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);
      console.log(data);

      connection.send(JSON.stringify({
        msg: 'pong',
        ackTs: data.clientTs,
        serverTs: Date.now()
      }))
    }
  });

  connection.on('open', function() {
    console.log("Connection open event");
  })

  connection.on('close', function(connection) {
    console.log("Connection close event");
  });
});
