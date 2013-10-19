var app = module.parent.exports.app
    , io = module.parent.exports.io
    , transit = require('../models/transit.js')
    , db = require('../models/');
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
    socket.on('add note', function(data) {
      note = new db.Note();
      note.message = data.message;
      note.active = true;
      note.dateTimeCreated = new Date();
      note.save(function(err) {
        if(err){
          socket.emit('news', { note: err })
        } else {
          socket.emit('news', { note: 'Note saved' })
        }
      });
    });
  });
});