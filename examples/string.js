var write = require('write');
var auth = require('../test/support/auth');
var repos = require('../');

repos('micromatch', auth)
  .then(function(res) {
    write.sync('micromatch.json', JSON.stringify(res, null, 2));
    return res;
  })
  .catch(console.error);
