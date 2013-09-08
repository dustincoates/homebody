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
  "A": "ACE",
  "C": "ACE",
  "E": "ACE",
  "B": "BDFM",
  "D": "BDFM",
  "F": "BDFM",
  "M": "BDFM",
  "G": "G",
  "J": "JZ",
  "Z": "JZ",
  "L": "L",
  "N": "NQR",
  "Q": "NQR",
  "R": "NQR",
  "S": "S",
  "SIR": "SIR"
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
              if (res[LINES[lines[i]]] !== 'GOOD SERVICE') {
                userStatuses[lines[i]] = res[LINES[lines[i]]]
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