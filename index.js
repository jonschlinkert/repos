'use strict';

var isObject = require('isobject');
var GitHub = require('github-base');
var reduce = require('p-reduce');

/**
 * Get repositories for one or more users.
 *
 * ```js
 * var repos = require('{%= name %}');
 * var options = {
 *   // see github-base for other authentication options
 *   token: 'YOUR_GITHUB_AUTH_TOKEN'
 * };
 * repos(['doowb', 'jonschlinkert'], options)
 *   .then(function(repos) {
 *     // array of repository objects
 *     console.log(repos);
 *   })
 *   .catch(console.error)
 * ```
 * @param {String|Array} `users` One or more user or organization names.
 * @param {Object} `options`
 * @return {Promise}
 * @api public
 */

module.exports = function(users, options) {
  if (typeof users === 'string') {
    users = [users];
  }

  if (!Array.isArray(users)) {
    return Promise.reject(new TypeError('expected users to be an array or string'));
  }

  var github = new GitHub(options);
  return getOrgs(github, users)
    .then(function(orgs) {
      return getRepos(github, orgs, options);
    });
};

/**
 * Get organizations for an array of users
 */

function getOrgs(github, users) {
  return reduce(users, function(acc, username) {
    return paged(github, '/users/:user/orgs', {user: username})
      .then(function(orgs) {
        if (maxLogins(orgs)) {
          return Promise.reject(new Error(orgs));
        }
        return acc.concat(orgs.map(org => org.login));
      });
  }, [])
    .then(function(orgs) {
      return users.map(user => ({owner: user, type: 'users'}))
        .concat(orgs.map(org => ({owner: org, type: 'orgs'})));
    });
}

/**
 * Get repos for an array of orgs ("users" orgs or "orgs" orgs).
 */

function getRepos(github, orgs) {
  return reduce(orgs, function(acc, org) {
    return paged(github, `/${org.type}/:owner/repos`, {owner: org.owner})
      .then(function(repos) {
        if (maxLogins(repos)) {
          return Promise.reject(new Error(repos));
        }
        return acc.concat(repos);
      });
  }, []);
}

/**
 * Create a new paged-request promise
 */

function paged(github, url, options) {
  return new Promise(function(resolve, reject) {
    github.paged(url, options, function(err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

function isError(obj) {
  return isObject(obj) && obj.message;
}

function maxLogins(obj) {
  return isError(obj) && /maximum number of login attempts/i.test(obj.message);
}
