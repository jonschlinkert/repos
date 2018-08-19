'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth.js');
const repos = require('../');

describe('repos', function() {
  this.timeout(10000);

  it('should catch error when invalid args are passed', () => {
    return repos().catch(err => assert(err));
  });

  it('should catch error when bad credentials are passed', () => {
    return repos('micromatch', { token: 'foo' })
      .catch(err => {
        assert.equal(err.message, 'Bad credentials');
      });
  });

  it('should get repos for the specified org', () => {
    return repos('micromatch', auth)
      .then(res => {
        assert(Array.isArray(res));
        assert(res.some(ele => ele.name === 'to-regex-range'));
        assert(res.some(ele => ele.name === 'nanomatch'));
        assert(res.some(ele => ele.name === 'extglob'));
      });
  });

  it('should get repos for an array of usernames', () => {
    return repos(['micromatch', 'breakdance'], auth)
      .then(res => {
        assert(Array.isArray(res));
        assert(res.length > 2);
      });
  });
});
