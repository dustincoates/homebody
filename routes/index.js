var app = module.parent.exports.app,
    transit = require('../models/transit.js');
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
});