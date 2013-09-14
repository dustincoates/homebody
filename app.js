
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public/stylus'
  , dest: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server = http.createServer(app).listen(app.get('port'));

var io = require('socket.io').listen(server);

// need to clean this up for each info type
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('add note', function(data) {
    console.log("!!!!!!!!!!!!");
    console.log(data);
  });
});

module.exports.app = app;
module.exports.io = io;
routes = require('./routes');