'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth.js');
var repos = require('../');

describe('repos', function() {
  this.timeout(10000);

  it('should catch error when invalid args are passed', function() {
    return repos().catch(err => assert(err));
  });

  it('should catch error when bad credentials are passed', function() {
    return repos('micromatch', { token: 'foo' })
      .catch(function(err) {
        assert.equal(err.message, 'Bad credentials');
      });
  });

  it('should get repos for the specified org', function() {
    return repos('micromatch', auth)
      .then(function(res) {
        assert(Array.isArray(res));
        assert(res.some(ele => ele.name === 'to-regex-range'));
        assert(res.some(ele => ele.name === 'nanomatch'));
        assert(res.some(ele => ele.name === 'extglob'));
      });
  });

  it('should get repos for an array of usernames', function() {
    return repos(['micromatch', 'breakdance'], auth)
      .then(function(res) {
        assert(Array.isArray(res));
        assert(res.length > 2);
      });
  });
});
