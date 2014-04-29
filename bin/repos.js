#!/usr/bin/env node

const path = require('path');
const log = require('verbalize');
const argv = require('minimist')(process.argv.slice(2));
const request = require('request');
const file = require('fs-utils');
const _ = require('lodash');

// Verbalize `runner`
log.runner = 'repos';

function displayHelp() {
  log.writeln();
  log.writeln('  Usage:');
  log.writeln(log.gray('   List repos for a user:'), log.bold(' repos USERNAME [args]'));
  log.writeln(log.gray('   List repos for an org:'), log.bold(' repos -o ORG-NAME [args]'));
  log.writeln();
  log.writeln('  General options:');
  log.writeln('   -h, --help', log.gray(' # Print options and usage information.'));
  log.writeln('   -u, --user', log.gray(' # List repos for the specified GitHub username.'));
  log.writeln('   -o, --org', log.gray('  # List repos for the specified GitHub org.'));
  log.writeln('   -d, --dest', log.gray(' # The destination file. Default is `repos.json`'));
  log.writeln();
}


// Use `-v` or `--verbose` for verbose logging
log.mode.verbose = argv.v || argv.verbose || false;
var help = argv.h || argv.help;

if (help) {
  displayHelp();
}

var type = 'users';

// Use `-u` or `--user` to specify the source file
var username = argv._[0] || argv.u || argv.user;

// Use `-o` or `--org` to get repos for an org instead of a user.
var repo = argv.o || argv.org;
var prop = argv.p || argv.prop || 'name';
var str = argv.s || argv.str || '.+';

// Use `-d` or `--dest` to specify the destination
var dest = argv._[1] || argv.d || argv.dest || username + '.json';
dest = path.join(process.cwd(), dest);

// Use `-a` or `--append` to append a string to the request URL;
var append = argv.a || argv.append || '?page=1&per_page=100';

if (!username) {
  throw new Error(log.red('No username was specified.'));
  displayHelp();
}

if(repo) {
  username = repo;
  type = 'orgs';
}

log.writeln();
log.writeln(log.gray('  ' + log.runner + ' [requesting]') + ' repos for', type.replace(/s$/, '') + ':', username);

var options = {
  url: 'https://api.github.com/' + [type, username, 'repos' + append].join('/'),
  headers: {
    'User-Agent': 'request'
  }
};

var filter = function filter(repos, prop, str) {
  return _.filter(repos, function(repo) {
    return new RegExp(str).test(repo[prop]) === true;
  });
};

function callback(err, response, body) {
  if (!err && response.statusCode == 200) {

    // Filter the results
    var repos = filter(JSON.parse(body), prop, str);
    file.writeJSONSync(dest, repos);

    var len = repos.length;
    var d = path.relative(process.cwd(), dest).replace(/\\/g, '/');
    log.writeln(log.gray('  ' + log.runner + ' [saved]'), len, 'repos to', d);
  } else {
    log.error(err);
    displayHelp();
  }

  // Success message.
  log.success('  ' + log.runner + ' [done]');
}

request(options, callback);