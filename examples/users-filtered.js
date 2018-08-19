const repos = require('../');
const auth = require('../test/support/auth');

const names = ['doowb', 'jonschlinkert'];
const options = {
  // filter out orgs we didn't create
  filterOrgs: org => !/(gulp|grunt)/.test(org.login),
  // filter out our own names and/or libraries we didn't create
  filterRepos(repo, acc) {
    return !acc.names.includes(repo.name)
      && !names.includes(repo.name)
      && !['archived', 'private', 'fork'].some(key => repo[key] === true)
  }
};

repos(names, { ...auth, ...options })
  .then(res => {
    console.log('REPOS:', res.length);
    console.log('STARS:', res.reduce((n, repo) => (n += repo.watchers), 0));
    // REPOS: 1,509
    // STARS: 27,064
  })
  .catch(err => console.log(err));
