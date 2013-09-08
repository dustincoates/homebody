var app = module.parent.exports.app,
    transit = require('../models/transit.js');
/*
 * GET home page.
 */

app.get('/', function(req, res) {
  transit.statuses(["G"], function(statuses) {
    console.log(statuses);
    res.render('index', { title: 'Express' });
  });
});

