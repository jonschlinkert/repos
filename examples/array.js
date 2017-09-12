var write = require('write-json');
var auth = require('../test/support/auth');
var repos = require('../');

repos(['doowb', 'jonschlinkert'], auth)
  .then(function(res) {
    write.sync('repos.json', res);
    return res;
  })
  .catch(console.error);
