#!/usr/bin/env node

const repos = require('../');
const argv = require('minimist')(process.argv.slice(2));
const write = require('write');

if (!argv.token && !(argv.username && argv.password)) {
  argv.token = process.env.GITHUB_TOKEN;
}

repos(argv._[0].split(','), argv)
  .then(res => {
    let filepath = argv._[1];
    if (!filepath) {
      return console.log(JSON.stringify(res, null, 2));
    }
    write(filepath, JSON.stringify(res, null, 2), err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`File was written to: ${filepath}`);
      process.exit();
    });
  });
