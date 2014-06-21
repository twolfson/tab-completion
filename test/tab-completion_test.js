// Load dependencies
var fsUtils = require('./utils/fs');
var TabCompletion = require('../');

// Verify we are in a contained environment
if (process.env.VAGRANT !== 'true' && process.env.TRAVIS !== 'true') {
  throw new Error('Tests must be run in enclosed environment (e.g. Vagrant, Travis) to prevent accidents on host OS');
}

// Start our tests
describe('tab-completion', function () {
  describe.skip('installed on a bash system', function () {
    fsUtils.unlink(process.env.HOME + '/.bashrc');
    fsUtils.cp(__dirname + '/test-files/empty-bashrc.sh', process.env.HOME + '/.bashrc');

    it('adds the script to the .bashrc file', function () {

    });

    describe('when completed against', function () {
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
