var mongoose = require('mongoose')
  , NoteSchema = require('./note');

function uri () {
  environment = process.env.NODE_ENV || "development";
  if ( environment === "development") {
    return "mongodb://localhost/homebody"
  } else{
    // TODO: Switch this out
    console.log(process.env.NODE_ENV);
  };
}

var connection = mongoose.connect(uri());

var Note = connection.model('Note', NoteSchema);

module.exports.Note = Note;