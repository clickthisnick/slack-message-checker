#!/usr/bin/env node

/* eslint-disable no-console */
const util = require('./../util.js'),
    _ = require('lodash'),
    constants = require('./../const.js');

return util.getBranchName()
  .then((branchName) => {
      const isPrefixed = util.isBranchNamePrefixed(branchName);

      // Don't give error for branches we don't want to be warned on
      if (_.includes(constants.IGNORE_NAME_BRANCHES, branchName)) {
          return;
      }

      if (!isPrefixed) {
          console.log('\n');
          console.log('\t\x1b[103m\x1b[30m', 'Branch name missing required prefix', '\x1b[0m');
          console.log('\t\x1b[103m\x1b[30m', 'Rename branch with one of the following commands:', '\x1b[0m');
          _.forEach(constants.BRANCH_PREFIXES, (prefix) => {
              console.log(`\tgit branch -m ${branchName} ${prefix}-${branchName}`);
          });
          console.log('\n');
      }
  });
