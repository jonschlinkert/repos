#!/usr/bin/env node

const repos = require('../');
const argv = require('minimist')(process.argv.slice(2));
const write = require('write');

repos(argv._[0].split(','), argv)
  .then(res => {
    let filepath = argv._[1] || 'repos.json';
    write(filepath, JSON.stringify(res, null, 2), err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`File was written to: ${filepath}`);
      process.exit();
    });
  });
