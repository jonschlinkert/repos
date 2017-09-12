'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth.js');
var repos = require('../');

describe('repos', function() {
  it('should catch error when invalid args are passed', function() {
    return repos()
      .catch(function(err) {
        assert(err);
      });
  });

  it('should catch error when "bad credentials" are passed', function() {
    this.timeout(10000);

    return repos('micromatch', {token: 'fososifdasifasifasifusaoifasoifusaoi'})
      .catch(function(err) {
        assert.deepEqual(err, {
          message: 'Bad credentials',
          documentation_url: 'https://developer.github.com/v3'
        });
      });
  });

  it('string username', function() {
    return repos('micromatch', auth)
      .then(function(res) {
        assert(Array.isArray(res));
        assert(res.length > 1);
      });
  });

  it('array of usernames', function() {
    return repos(['micromatch', 'breakdance'], auth)
      .then(function(res) {
        assert(Array.isArray(res));
        assert(res.length > 2);
      });
  });
});
