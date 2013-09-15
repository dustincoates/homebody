var Notes = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Note.all(function(err, notes) {
      self.respond({params: params, notes: notes});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , note = geddy.model.Note.create(params);

    if (!note.isValid()) {
      this.flash.error(note.errors);
      this.redirect({action: 'add'});
    }
    else {
      note.save(function(err, data) {
        if (err) {
          self.flash.error(err);
          self.redirect({action: 'add'});
        }
        else {
          self.redirect({controller: self.name});
        }
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Note.first(params.id, function(err, note) {
      if (!note) {
        var err = new Error();
        err.statusCode = 404;
        self.error(err);
      }
      else {
        self.respond({params: params, note: note.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Note.first(params.id, function(err, note) {
      if (!note) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      }
      else {
        self.respond({params: params, note: note});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Note.first(params.id, function(err, note) {
      note.updateProperties(params);
      if (!note.isValid()) {
        self.flash.error(note.errors);
        self.redirect({action: 'edit'});
      }
      else {
        note.save(function(err, data) {
          if (err) {
            self.flash.error(err);
            self.redirect({action: 'edit'});
          }
          else {
            self.redirect({controller: self.name});
          }
        });
      }
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Note.remove(params.id, function(err) {
      if (err) {
        self.flash.error(err);
        self.redirect({action: 'edit'});
      }
      else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Notes = Notes;
