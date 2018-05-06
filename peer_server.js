var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(express.static('public'));

var server = app.listen(5103);

var options = {
    debug: true
}

app.use('/api', ExpressPeerServer(server, options));

server.listen(5103);
console.log('Peer JS Server started on port 9000');
