var write = require('write-json');
var auth = require('../test/support/auth');
var repos = require('../');

repos('micromatch', auth)
  .then(function(res) {
    write.sync('micromatch.json', res);
    return res;
  })
  .catch(console.error);
