var CreateNotes = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('', '');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('note', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('note', callback);
  };
};

exports.CreateNotes = CreateNotes;
