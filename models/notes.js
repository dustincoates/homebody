var Schema = require('mongoose').Schema;

var NoteSchema = Schema({
  dateCreated: {type: Date, required: true}
  , message: {type: String, required: true}
})

module.exports = NoteSchema;