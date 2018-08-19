'use strict';

const GitHub = require('github-base');
const orgs = require('orgs');

/**
 * Get repositories for one or more users.
 *
 * ```js
 * const repos = require('repos');
 * const options = {
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
 * @param {String|Array} `users` One or more users or organization names.
 * @param {Object} `options` See available [options](#options).
 * @return {Promise}
 * @api public
 */

module.exports = async (users, options) => {
  if (isObject(users)) {
    return new GitHub(users).paged('/user/repos');
  }

  if (typeof users === 'string') {
    users = [users];
  }

  if (!Array.isArray(users)) {
    return Promise.reject(new TypeError('expected users to be a string or array'));
  }

  const acc = { repos: [], names: [] };
  const opts = Object.assign({}, options);
  const noop = () => true;
  const filterRepos = opts.filterRepos || noop;
  const filterOrgs = opts.filterOrgs || noop;

  // don't pass custom options to module dependencies
  delete opts.filterRepos;
  delete opts.filterOrgs;

  const github = new GitHub(opts);
  const arr = await orgs(users, opts);

  for (const org of arr) {
    if (filterOrgs(org) !== true) continue;

    const rep = await github.paged(`/${type(org)}/${org.login}/repos`);

    for (const page of rep.pages) {
      for (const repo of page.body) {
        if (filterRepos(repo, acc) === true) {
          acc.names.push(repo.name);
          acc.repos.push(repo);
        }
      }
    }
  }

  if (opts.sort !== false) {
    return acc.repos.sort(compare('name'));
  }

  return acc.repos;
};

function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function compare(prop) {
  return (a, b) => (a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0);
}

function type(org) {
  return org.type === 'User' ? 'users' : 'orgs';
}
