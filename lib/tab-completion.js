// Load in dependencies
var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var homepath = require('homepath');
var minstache = require('minstache');

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
  _findExistingRcs: function (cb) {
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
    // DEV: We strongly follow Travis CI's gem https://github.com/travis-ci/travis.rb/blob/v1.6.14/lib/travis/tools/completion.rb
    // TODO: We should only perform this for global installs (could detect via `npm.globalPath`)
    // Get shell .rc file candidates
    // TODO: We should prob leverage `async.waterfall`
    var that = this;
    this._findExistingRcs(function handleRcs (err, filepaths) {
      // If there was an error, callback with it
      if (err) {
        return cb(err);
      }

      // Otherwise, if there are no filepaths, callback early
      if (!filepaths.length) {
        return cb(null, []);
      }

      // Otherwise, template and copy over the latest completion script
      that._renderCompletionScript(function handleCompletionScript (err, completionScript) {
        // If there was an error, callback with it
        if (err) {
          return cb(err);
        }

        // Otherwise, write the completion script to file
        // TODO: What if `this.name` contains `..` or `/`?
        var dest = path.join(TabCompletion.completionDirectory, this.name);
        that._writeCompletionScript(dest, completionScript, function handleWrite (err) {
          // If there was an error, callback with it
          if (err) {
            return cb(err);
          }

          // TODO: Add invocations for our script to .rc files
          // TODO: Callback with results
        });
      });
    });
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
