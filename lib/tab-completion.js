// Load in dependencies
var async = require('async');
var fs = require('fs');
var path = require('path');
var homepath = require('homepath');

/**
 * Constructor for tab completion installer/remover
 * @param {String} name Name of the executable we are installing tab completion for
 */
function TabCompletion(name) {
  // Save name for later
  this.name = name;
}
TabCompletion.targetLocations = [
  path.join(homepath, '.bashrc'), // ~/.bashrc
  path.join(homepath, '.zshrc') // ~/.zshrc
];
TabCompletion.prototype = {
  // Helper to find existing bashrc/zshrc paths
  _findExistingRcs: function (cb) {
    // DEV: We cannot inline `fs.stat` because an error would cause early termination
    async.parallel(TabCompletion.targetLocations, function determineFileExists (filepath, cb) {
      fs.stat(filepath, function handleExistsResult (err, stat) {
        // If there is an error, assume no file
        if (err) {
          return cb(null, null);
        }

        // Otherwise, if the file is not a file, specify no file
        if (!stat.isFile()) {
          return cb(null, null);
        }

        // Otherwise, callback with the filepath
        return cb(null, filepath);
      });
    }, function handleExistsResults (err, filepaths) {
      // If there is an error, callback with it
      // DEV: This is not possible but it is good to be consistent
      if (err) {
        return cb(err);
      }

      // Otherwise, filter the found filepaths
      var foundFilepaths = filepaths.filter(function isValidFilepath (filepath) {
        return !!filepath;
      });
      cb(null, foundFilepaths);
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
      // TODO: Template script (prob via method)
      // TODO: mkdir -p for our script, still not sure where (maybe `.npm/completion.d/`?)
      // TODO: Write out our template to the file
        // TODO: Add invocations for our script to .rc files
        // TODO: Callback with results
    });
  },
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
