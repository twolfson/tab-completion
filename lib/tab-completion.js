// Load in dependencies
var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var homepath = require('homepath');
var minstache = require('minstache');
var quote = require('shell-quote').quote;

// DEV: We strongly follow Travis CI's gem https://github.com/travis-ci/travis.rb/blob/v1.6.14/lib/travis/tools/completion.rb

/**
 * Constructor for tab completion installer/remover
 * @param {String} name Name of the executable we are installing tab completion for
 */
function TabCompletion(name) {
  // Save name for later
  this.name = name;
}
TabCompletion.completionDirectory = path.join(homepath, '.config/node-tab-completion/');
TabCompletion.rcLocations = [
  path.join(homepath, '.bashrc'), // ~/.bashrc
  path.join(homepath, '.zshrc') // ~/.zshrc
];
TabCompletion.prototype = {
  // Helper to find existing bashrc/zshrc paths
  _getRcFiles: function (cb) {
    // DEV: We cannot inline `fs.stat` because an error would cause early termination
    // DEV: This script is intended to be bullet proof which is why we use `stat` to verify files are files instead of `fs.exists`
    async.filter(TabCompletion.rcLocations, function determineFileExists (filepath, callback) {
      fs.stat(filepath, function handleExistsResult (err, stat) {
        // If there is an error, reject it
        if (err) {
          return callback(false);
        }

        // Otherwise, if the file is not a file, reject it
        if (!stat.isFile()) {
          return callback(false);
        }

        // Otherwise, approve the filepath
        return callback(true);
      });
    }, function handleResults (results) {
      // Normalize filtered results to error-first notation
      cb(null, results);
    });
  },

  /**
   * Install tab completion to bash and zsh if possible
   * @param {Function} cb Optional error-first callback function, `(err, results)`, to receive results
   *    If no `cb` is provided and there is an error, then it be thrown
   * @callback {Error|null} err If an error occurred, this will contain such info
   * @callback {String[]} results Locations where script was installed to
   */
  install: function (cb) {
    // TODO: We should only perform this for global installs (could detect via `npm.globalPath`)
    var rcFilepaths;
    var scriptFilepath;
    var that = this;
    async.waterfall([
      // Get shell .rc file candidates
      function getRcFiles (callback) {
        that._getRcFiles(callback);
      },
      function handleRcFiles (_rcFilepaths, callback) {
        // If there are no rcFilepaths, callback early
        rcFilepaths = _rcFilepaths;
        if (!rcFilepaths.length) {
          return cb(null, []);
        }

        // Otherwise, continue
        callback(null);
      },
      // Template and copy over the latest completion script
      function renderCompletionScript (callback) {
        that._renderCompletionScript(callback);
      },
      function writeCompletionScript (completionScript, callback) {
        // TODO: What if `this.name` contains `..` or `/`?
        scriptFilepath = path.join(TabCompletion.completionDirectory, that.name);
        that._writeCompletionScript(scriptFilepath, completionScript, callback);
      },
      // Write invocations to each of the .rc files
      function writeCompletionInvocations (callback) {
        async.forEach(rcFilepaths, function writeCompletionInvocationFn (rcFilepath, done) {
          that.writeCompletionInvocation(rcFilepath, scriptFilepath, done);
        }, callback);
      },
      // Callback with results
      function callbackWithResults (callback) {
        cb(null, rcFilepaths);
      }
    ], cb);
  },

  // Helper to render new scripts
  _renderCompletionScript: function (cb) {
    // TODO: Consider loading this synchronously at require-time
    // Load in our template
    var that = this;
    fs.readFile(__dirname + '/completion.mustache.sh', 'utf8', function handleScript (err, completionTemplate) {
      // If there was an error, callback with it
      if (err) {
        return cb(err);
      }

      // Otherwise, generate our completion script and callback with it
      var completionScript = minstache(completionTemplate, {name: that.name});
      cb(null, completionScript);
    });
  },

  // Helper to write script invocation inside .rc file
  writeCompletionInvocation: function (rcFilepath, scriptFilepath, cb) {
    // Define our content
    var content = [
      '', // Guarantee we are on a different line, even if there is no trailing new line
      '# Added by ' + quote([this.name]),
      quote(['[', '-f', scriptFilepath, ']', '&&', 'source', scriptFilepath])
        // Compiles to: `[ -f $HOME/.config/node-tab-completion/hello ] && source $HOME/.config/node-tab-completion/hello`
        // which means "if there is a completion file, load it into the current shell"
    ].join('\n');

    // Add the content to the .rc file
    fs.appendFile(rcFilepath, content, cb);
  },

  // Helper to write to new file location
  // TODO: I feel like there is a node module for this (grunt def does this)
  _writeCompletionScript: function (filepath, content, cb) {
    // mkdir -p to the destination's base directory
    var dirpath = path.dirname(filepath);
    mkdirp(dirpath, function handleMkdir (err) {
      // If there was an error, callback with it
      if (err) {
        return cb(err);
      }

      // Otherwise, write out our template to the file
      fs.writeFile(filepath, content, cb);
    });
  }

  // DEV: We do not yet have an uninstall script because there is no guaranteed way to determine whether we are uninstalling globally or locally
  // As a result, we try to make everything as much of a singleton as possible
  /**
   * Remove tab completion from bash and zsh
   * @param {Function} cb Optional error-first callback function, `(err, results)`, to receive results
   *    If no `cb` is provided and there is an error, then it be thrown
   * @callback {Error|null} err If an error occurred, this will contain such info
   * @callback {String[]} results Locations where script was removed from
   */
  // uninstall: function (cb) {
    // // TODO: Undo what install did
  // }
};

module.exports = TabCompletion;
