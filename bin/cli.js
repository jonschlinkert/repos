#!/usr/bin/env node

var repos = require('../');
var argv = require('minimist')(process.argv.slice(2));
var write = require('write-json');
var ok = require('log-ok');

repos(argv._[0].split(','), argv)
  .then(function(res) {
    write(argv._[1], function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      ok('done');
      process.exit();
    });
  });
