const write = require('write');
const auth = require('../test/support/auth');
const repos = require('../');

repos('micromatch', auth)
  .then(res => {
    write.sync('micromatch.json', JSON.stringify(res, null, 2));
    return res;
  })
  .catch(console.error);
