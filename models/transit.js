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