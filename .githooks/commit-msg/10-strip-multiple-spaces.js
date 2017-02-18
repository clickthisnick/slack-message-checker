#!/usr/bin/env node

const util = require('./../util.js'),
    _ = require('lodash');

return util.getCommitMessage()
  .then((commitMsg) => {
      // Remove multiple spaces and spaces surrounding message
      const sanitizedCommitMsg = _(commitMsg)
          .replace(/ +/g, ' ') // eslint-disable-line no-regex-spaces
          .trim();

      return util.writeCommitMessage(sanitizedCommitMsg);
  });
