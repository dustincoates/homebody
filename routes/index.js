var app = module.parent.exports.app
    , io = module.parent.exports.io
    , Transit = require('../models/transit.js').Transit
    , db = require('../models/');
/*
 * GET home page.
 */

app.get('/data/mta/:lines', function(req, res) {
  var lines = req.param('lines').split("+");
  var transit = new Transit(lines);
  transit.getStatus(function(err, status) {
    if (err) {
      console.log("There's been an error");
      console.log(err);
    } else{
      console.log(status);
    };
    res.render('index', { title: 'Express' });
  });
});

app.get('/hello', function(req, res) {
  res.render('hello', { title: 'Express' });
});

// need to clean this up for each info type
// Should probably move this to a socket router file
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
        console.log("Note saved");
        socket.emit('news', { note: 'Note saved' })
      }
    });
  });
});