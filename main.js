var https = require('https');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');

// config
var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8'));
console.log('jsy-evt-cal starting');
console.log('config.http.port: ' + config.http.port);
console.log('config.http.port: ' + config.ssl.key);
console.log('config.http.port: ' + config.ssl.cert);
console.log('config.http.port: ' + config.ssl.ca);

// create an https server
var credentials = {
    key: fs.readFileSync(config.ssl.key, 'utf8'),
    cert: fs.readFileSync(config.ssl.cert, 'utf8'),
    ca: fs.readFileSync(config.ssl.ca, 'utf8'),
};
var server = https.createServer(credentials, function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('cal sec (auto)');
});

// start
server.listen(config.http.port, function() {
    console.log('started https server, listening on port ' + config.http.port);
});

