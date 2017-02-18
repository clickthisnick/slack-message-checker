#!/usr/bin/env node

const util = require('./../util.js'),
    _ = require('lodash');

let branchName;

return util.getBranchName()
    .then((res) => branchName = res)
    .then(() => util.getCommitMessage())
    .then((commitMsg) => {

        // Commit message should be branch "Prefix - commitMessage"
        const isBranchPrefixed = util.isBranchNamePrefixed(branchName),
            commitPrefix = `${_.upperFirst(util.getPrefix(branchName))} - `;

        // When you rebase and reword a commit, you cannot run the git command to get the branch name, it will error and prefix ' - '
        if (!_.isNil(branchName.error) || _.isNil(branchName) || branchName === '') {
            return;
        }

        // If branch is not prefixed don't add any prefix since we don't know what it would be
        if (!isBranchPrefixed) {

            // Make sure the commit message starts with a capital letter
            if (commitMsg !== _.upperFirst(commitMsg)) {
                util.writeCommitMessage(_.upperFirst(commitMsg));
                return;
            }
            return;
        }

        // Prepend branch prefix to commit and make sure the commitMsg starts with a capital letter git
        if (!_.startsWith(commitMsg, commitPrefix)) {
            util.writeCommitMessage(`${commitPrefix}${_.upperFirst(commitMsg)}`);
            return;
        }
    });
