var Schema = require('mongoose').Schema;

var NoteSchema = Schema({
  dateTimeCreated: {type: Date, required: true}
  , message: {type: String, required: true}
  , active: {type: Boolean, required: true}
})

module.exports = NoteSchema;