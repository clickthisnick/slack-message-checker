#!/usr/bin/env node

/* eslint-disable no-console */
const util = require('./../util.js'),
    constants = require('./../const.js'),
    _ = require('lodash');

return util.bash('which aspell') // eslint-disable-line consistent-return
    .then((aspell) => { // eslint-disable-line consistent-return
        if (!_.isNil(aspell.error)) {
            console.log('\n');
            console.log('\t\x1b[103m\x1b[30m', 'Cannot check commit spelling unless you install aspell', '\x1b[0m');
            console.log('\t\x1b[103m\x1b[30m', 'To install use command:', '\x1b[0m');
            console.log('\tbrew install aspell');
            console.log('\n');
        } else {
            return util.bash(`${aspell.output} list < ${constants.COMMIT_MSG_PATH} | sort -u`)
                .then((res) => {
                    // The aspell command will return '' if there are no misspellings
                    if (res.output === '') {
                        return;
                    }

                    // Adding s to the words and also ignoring them
                    const ignoredWordsWithS = _.map(constants.IGNORED_MISSPELLINGS, (word) => `${word}s`),
                        ignoredWordList = _.concat(constants.IGNORED_MISSPELLINGS, ignoredWordsWithS),
                        misspelledWords = _(res.output)
                            .split('\n')
                            .map((word) => _.lowerCase(word))
                            .remove((word) => !_.includes(ignoredWordList, word))
                            .value();

                    if (misspelledWords.length === 0) {
                        return;
                    }

                    console.log('\n');
                    console.log('\t\x1b[103m\x1b[30m', 'The following words are possibly misspelled', '\x1b[0m');
                    _.forEach(misspelledWords, (word) => console.log(`\t${word}`));
                    console.log('\t\x1b[103m\x1b[30m', 'To fix use command:', '\x1b[0m');
                    console.log('\tgit commit --amend');
                    console.log('\n');
                });
        }
    });
