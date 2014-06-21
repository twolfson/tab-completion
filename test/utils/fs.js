// Load in dependencies
var cp = require('cp');

// Define common fs helpers
exports.cp = function (src, dest) {
  before(function cpFn (done) {
    cp(src, dest, done);
  });
};

exports.readFile = function (filepath) {
  before(function readFileFn (done) {
    // Load the file into memory and callback with any errors
    var that = this;
    fs.readFile(filepath, function handleFileRead (err, buff) {
      that.buff = buff;
      done(err);
    });
  });
  after(function cleanupFileFn () {
    delete this.buff;
  });
};

exports.unlink = function (filepath) {
  before(function unlinkFn (done) {
    unlink(filepath, done);
  });
};
