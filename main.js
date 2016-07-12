// dependencies
var express = require('express');
var https = require('https');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');
var sass = require('node-sass-middleware');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

// local dependencies
var routes = require('./routes');

// config
var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8'));
console.log('jsy-evt-cal starting');
console.log('config.http.port:                      ' + config.http.port);
console.log('config.ssl.key:                        ' + config.ssl.key);
console.log('config.ssl.cert:                       ' + config.ssl.cert);
console.log('config.ssl.ca:                         ' + config.ssl.ca);
console.log('config.session.secret:                 ' + config.session.secret);
console.log('config.session.sessionExpiryInSeconds: ' + config.session.sessionExpiryInSeconds);

// setup express
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(session({
    store: session.MemoryStore(), // okay for now
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false, // stops a session from being written until logged in
    cookie: {
        // milliseconds
        maxAge: config.session.sessionExpiryInSeconds * 1000,
    },
    rolling: true,
}));
app.use(
    sass({
        src: path.join(__dirname, '/scss'),
        dest: path.join(__dirname, '/public/scss'),
        prefix: '/scss',
        debug: false,
    })
);
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', routes.getHomeRoute());

// create an https server
var credentials = {
    key: fs.readFileSync(config.ssl.key, 'utf8'),
    cert: fs.readFileSync(config.ssl.cert, 'utf8'),
    ca: fs.readFileSync(config.ssl.ca, 'utf8'),
};
var server = https.createServer(credentials, app);

// start 
server.listen(config.http.port, function() {
    console.log('started https server, listening on port ' + config.http.port);
});

