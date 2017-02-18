#!/usr/bin/env node

/* eslint-disable no-console */
const util = require('./../util.js'),
    _ = require('lodash'),

    // The amount of words needed including the prefix
    minimumWordCount = 5,

    // Word count for the preappended prefix to every commit message
    prefixWords = 2;

return util.getCommitMessage()
    .then((commitMessage) => {
        const wordCount = commitMessage.split(' ').length,
            errorString = [];

        if (wordCount < minimumWordCount) {
            errorString.push(`Commit Message: "${commitMessage}" Not Descriptive. Please use at least ${minimumWordCount - prefixWords} words after prefix`);
        }

        if (errorString.length > 0) {
            // http://misc.flogisoft.com/bash/tip_colors_and_formatting
            console.log('\n');
            console.log('\t\x1b[103m\x1b[30m', _.join(errorString, '\n'), '\x1b[0m');
            console.log('\t\x1b[31m', 'Aborting Commit.', '\x1b[0m');
            console.log('\n');
            process.exit(1);
        }
    });
