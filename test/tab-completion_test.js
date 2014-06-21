var tab_completion = require('../');

if (process.env.VAGRANT !== 'true' || process.env.TRAVIS !== 'true') {
  throw new Error('Tests must be run in enclosed environment (e.g. Vagrant, Travis) to prevent accidents on host OS');
}

describe('tab-completion', function () {
  before(function () {
    // http://stackoverflow.com/a/9505024/1960509
    // COMP_LINE="foundry re" COMP_WORDS=(foundry re) COMP_CWORD=1 COMP_POINT=10 $(complete -p foundry | sed "s/.*-F \\([^ ]*\\) .*/\\1/") && echo ${COMPREPLY[*]}
  });

  it('', function () {

  });
});
