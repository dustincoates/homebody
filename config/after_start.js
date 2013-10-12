
/*
 * https://gist.github.com/larzconwell/4470370
*/

var fs = require('fs')
  , path = require('path')
  , nib = require('nib');

// Compilers
var stylus;

// Watch all files in the given source directory,
// and compile them to the correct dest directory
function watchAndCompile(source, dest, callback) {
  var destPath = ''

  // Watch all paths on the base source directory
  watch(source, dest, callback)

  fs.readdir(source, function (err, paths) {
    if (err)
      callback(err)

    paths.forEach(function (p) {
      p = path.join(source, p)

      fs.stat(p, function (err, stats) {
        if (err)
          callback(err)

        // If the path is a directory, create the destination for it
        // and watch that directory
        if (stats.isDirectory()) {
          destPath = path.join(dest, p.replace(source, ''))

          fs.mkdir(destPath, 0777, function (err) {
            if (err && err.code !== 'EEXIST')
              callback(err)

            watchAndCompile(p, destPath, callback)
          })
        }

        // If it's a file go ahead a compile it to start off
        if (stats.isFile())
          compile(p, dest)
      })
    })
  })
}

// Watch a directory and compile a file in it on a change
// event if it exists
function watch (dir, dest, callback) {
  fs.watch(dir, function (ev, p) {
    if (ev === 'change')
      p = path.join(dir, p)

    fs.exists(p, function (exists) {
      if (exists)
        compile(p, dest, callback)
    })
  })
}

function compile (p, dest, callback) {
  var baseFile = path.basename(p)
    , baseExt = path.extname(baseFile).slice(1)
    , destFile = path.join(dest, path.basename(p, '.styl')) + '.css'
    , write

  write = function (contents) {
    fs.writeFile(destFile, contents, 'utf-8', function (err) {
      if (err){
        callback(err)
      }

      geddy.log.info('Compiled ' + p + ' to ' + destFile)
    })
  }

  // Read file contents
  fs.readFile(p, 'utf-8', function (err, data) {
    if (err){
      callback(err)
    }

    // Stylus
    if (baseExt === 'styl') {
      stylus = stylus || require('stylus')

      stylus(data)
        .use(nib())
        .render(function (err, css) {
          if (err){
            console.log(err);
          }

          write(css)
        })
    }
  })
}

watchAndCompile('app/assets/css', 'public/css', function (err) {
  if (err)
    throw err
})

geddy.io.sockets.on('connection', function(socket) {
  socket.emit('hello', {message: "world"});
  socket.on('message', function(message) {
    geddy.log.notice(message);
  });
});