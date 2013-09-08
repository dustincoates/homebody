var app = module.parent.exports.app,
    transit = require('../models/transit.js');
/*
 * GET home page.
 */

app.get('/', function(req, res) {
  transit.directions("Brooklyn", "Queens");
  res.render('index', { title: 'Express' });
});
