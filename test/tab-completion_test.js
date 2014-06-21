// Load dependencies
var expect = require('chai').expect;
var fsUtils = require('./utils/fs');
var TabCompletion = require('../');

// Verify we are in a contained environment
if (process.env.VAGRANT !== 'true' && process.env.TRAVIS !== 'true') {
  throw new Error('Tests must be run in enclosed environment (e.g. Vagrant, Travis) to prevent accidents on host OS');
}

// Define helpers for our tests
var tabCompletionUtils = {
  install: function (name) {
    before(function installFn (done) {
      // Create and install a new TabCompletion
      var that = this;
      var tabCompletion = new TabCompletion(name);

      tabCompletion.install(function handleResults (err, results) {
        // Save the results and callback
        that.err = err;
        that.results = results;
        done();
      });
    });
    after(function cleanupInstall () {
      // Clean up saved variables
      delete this.err;
      delete this.results;
    });
  }
};

// Start our tests
describe('tab-completion', function () {
  describe('installed on a bash system', function () {
    fsUtils.unlink(process.env.HOME + '/.bashrc');
    fsUtils.cp(__dirname + '/test-files/bashrc.sh', process.env.HOME + '/.bashrc');
    tabCompletionUtils.install('bash-test');

    it('informs us that the script was added to the .bashrc file', function () {
      expect(this.err).to.equal(null);
      expect(this.results).to.contain(process.env.HOME + '/.bashrc');
    });

    it.skip('adds the script to the .bashrc file', function () {
    });

    describe.skip('when completed against', function () {
      // http://stackoverflow.com/a/9505024/1960509
      // COMP_LINE="foundry re" COMP_WORDS=(foundry re) COMP_CWORD=1 COMP_POINT=10 $(complete -p foundry | sed "s/.*-F \\([^ ]*\\) .*/\\1/") && echo ${COMPREPLY[*]}

      it('runs our completion command', function () {

      });
    });

    describe('when uninstalled', function () {
      it('leaves the .bashrc like it found it', function () {

      });
    });
  });

  describe.skip('installed on a zsh system', function () {
    it('adds the script to the .zsh file', function () {

    });

    describe('when completed against', function () {
      it('runs our completion command', function () {

      });
    });

    describe('when uninstalled', function () {
      it('leaves the .zsh like it found it', function () {

      });
    });

  });

  describe.skip('installed on a non-bash/zsh system', function () {
    it('does not generate a .bashrc file', function () {

    });

    it('does not generate a .zshrc file', function () {

    });
  });
});
