// Define our constructor
function TabCompletion(name) {
  // Save name for later
  this.name = name;
}
TabCompletion.prototype = {
  install: function (cb) {
    // TODO: If we are in Windows, callback with a Windows-specific error (which will be silenced in the `bin` script)
    // TODO: Attempt to install to `/usr/local/etc/somewhere-that-bash-completion-is-loaded`
    // TODO: We might be better off attempting to install to ~/.profile, ~/.bashrc, or ~/.bash_profile
      // TODO: What about zsh?
    // TODO: Let's follow the Travis gem https://github.com/travis-ci/travis.rb/blob/v1.6.14/lib/travis/tools/completion.rb
  },
  uninstall: function (cb) {
    // TODO: Undo what install did
  }
};

module.exports = TabCompletion;
