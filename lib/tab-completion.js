// Load in dependencies
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
  path.join(homepath, '.zsh') // ~/.zshrc
];
TabCompletion.prototype = {
  /**
   * Install tab completion to bash and zsh if possible
   * @param {Function} cb Optional error-first callback function, `(err, results)`, to receive results
   *    If no `cb` is provided and there is an error, then it be thrown
   * @callback {Error|null} err If an error occurred, this will contain such info
   * @callback {String[]} results Locations where script was installed to
   */
  install: function (cb) {
    // TODO: Let's follow the Travis gem https://github.com/travis-ci/travis.rb/blob/v1.6.14/lib/travis/tools/completion.rb
  },
  /**
   * Remove tab completion from bash and zsh
   * @param {Function} cb Optional error-first callback function, `(err, results)`, to receive results
   *    If no `cb` is provided and there is an error, then it be thrown
   * @callback {Error|null} err If an error occurred, this will contain such info
   * @callback {String[]} results Locations where script was removed from
   */
  uninstall: function (cb) {
    // TODO: Undo what install did
  }
};

module.exports = TabCompletion;
