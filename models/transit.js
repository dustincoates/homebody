var parseString = require('xml2js').parseString,
    http = require('http');

exports.directions = function(orig, dest, arrivalTime) {
  var opts = {
    host: 'www.mta.info',
    path: '/status/serviceStatus.txt',
    method: 'GET'
  }

  var req = http.get(opts, function(res) {
    var body = '';
    res.on('data', function (data) {
      body += data;
    });

    res.on('end',function() {
      parseString(body,function(err, res) {
        // Next step here;
      });
    });
  });

  req.on('error',function(err) {
    console.log(err);
  });
};