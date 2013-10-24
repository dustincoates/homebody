var Schema = require('mongoose').Schema,
    connection = require('./connection');

var noteSchema = Schema({
  dateTimeCreated: {type: Date, required: true}
  , message: {type: String, required: true}
  , active: {type: Boolean, required: true}
})

// noteSchema.methods.foo = function(){};

var Note = connection.model('Note', noteSchema);

module.exports = Note;