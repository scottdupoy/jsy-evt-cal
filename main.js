var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('cal');
});

server.listen(8084);

console.log('started');

