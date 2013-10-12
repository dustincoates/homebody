var app = module.parent.exports.app
    , io = module.parent.exports.io
    , transit = require('../models/transit.js');
/*
 * GET home page.
 */

app.get('/data/mta/:lines', function(req, res) {
  var lines = req.param('lines').split("+");
  transit.statuses(lines, function(statuses) {
    console.log(statuses);
    res.render('index', { title: 'Express' });
  });
});

app.get('/hello', function(req, res) {
  res.render('hello', { title: 'Express' });
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
});