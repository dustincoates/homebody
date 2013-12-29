var app = module.parent.exports.app
    , io = module.parent.exports.io
    , Transit = require('../models/').Transit
    , Note = require('../models/').Note
    , Weather = require('../models/').Weather;
/*
 * GET home page.
 */

app.get('/data/mta/:lines', function(req, res) {
  var lines = req.param('lines').split("+")
    , transit = new Transit(lines);
  transit.getStatus(function(err, status) {
    if (err) {
      console.log("There's been an error");
      console.log(err);
    } else{
      console.log(status);
    };
    // TODO: Should likely be JSON
    res.render('index', { title: 'Express' });
  });
});

app.get('/data/weather/:lat/:lng', function(req, res) {
  var lat = req.param('lat')
    , lng = req.param('lng');
  weather = new Weather(lat, lng);
  weather.getForecast(function(data) {
    res.render('index', { title: data.icon });
  });
});

// TODO: Decide if this is kept or not
app.get('/track', function(req, res) {
  res.render('track/index', { title: 'Track Your Day'})
});

app.get('/dashboard', function(req, res) {
  res.render('dashboard', { title: 'Express' });
});

// TODO:
// need to clean this up for each info type
// Should probably move this to a socket router file
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('add note', function(data) {
    note = new Note();
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