// TODO: Cache the MTA info.

var parseString = require('xml2js').parseString,
    http = require('http'),
    repl = require('repl');

var LINES = {
  "1": "123",
  "2": "123",
  "3": "123",
  "4": "456",
  "5": "456",
  "6": "456",
  "7": "7",
  "a": "ACE",
  "c": "ACE",
  "e": "ACE",
  "b": "BDFM",
  "d": "BDFM",
  "f": "BDFM",
  "m": "BDFM",
  "g": "G",
  "j": "JZ",
  "z": "JZ",
  "l": "L",
  "n": "NQR",
  "q": "NQR",
  "r": "NQR",
  "s": "S",
  "sir": "SIR"
}

module.exports.statuses = function(lines, callback) {
  var opts = {
        host: 'www.mta.info',
        path: '/status/serviceStatus.txt',
        method: 'GET'
      },
      userStatuses = {};

  var req = http.get(opts, function(res) {
    var body = '';
    res.on('data', function (data) {
      body += data;
    });

    res.on('end', function() {
      parseString(body, function(err, res) {
        var subwayLines = res.service.subway[0].line;

        return lineStatuses(subwayLines, function(res) {
            for (var i = lines.length - 1; i >= 0; i--) {
              lineName = lines[i].toLowerCase();
              if (res[LINES[lineName]] !== 'GOOD SERVICE') {
                userStatuses[lineName] = res[LINES[lineName]]
              };
            };
        });
      });
      callback(userStatuses);
    });
  });

  req.on('error',function(err) {
    callback(err);
  });
};

function lineStatuses (subwayData, callback) {
  var statuses = {};
  for (var i = subwayData.length - 1; i >= 0; i--) {
    statuses[subwayData[i].name[0]] = subwayData[i].status[0];
  };
  callback(statuses);
}

//
//
//
//
//
//
//
//

var app = module.parent.exports.app
    , io = module.parent.exports.io
    , transit = require('../models/transit.js')
    , models = require('../models');
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

app.get('/dashboard/:id/manage', function(req, res) {
  res.render('dashboard/edit', { title: 'Express' });
  // need to clean this up for each info type
  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
    socket.on('add note', function(data) {
      var note = new models.Note({
        dateTimeCreated: new Date()
        , message: data.note
        , active: true
      });
      note.save(function(err) {
        if(err){
          console.log(err);
        } else {
          socket.emit('news', {note: 'Success'})
        }
      });
    });
  });
});