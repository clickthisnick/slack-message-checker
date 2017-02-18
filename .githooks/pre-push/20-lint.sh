#!/bin/bash
#
# Lints files before you can push code to CircleCi
#

# Gets an array of files that have changed
modifiedFiles=($(git diff --name-only `git merge-base origin/master HEAD`))

# Gets the amount of files that have changed
modifiedFilesLength=${#modifiedFiles[@]}

# Declare an array to store files that need to be linted
filesToLint=()

# Loops through the changed files pushs any files that need to be linted into the filesToLint array
for (( i=0; i<${modifiedFilesLength}; i++ ));
do
  # If file ends with .js add it to filesToLint array
  if [[ ${modifiedFiles[$i]} == *.js ]]
  then
    filesToLint+=(${modifiedFiles[$i]})
  fi
done

# If filesToLint is an empty array exit since there is no linting that needs to happen
if [ -z "$filesToLint" ]; then
    exit 0 # push will execute
fi

printf '\n\tLinting Javascript Files...\n'

# eslint lints multiple files like this -> eslint [options] file.js [file.js] [dir]
if ./node_modules/.bin/eslint --no-ignore --max-warnings=0 "${filesToLint[@]}"; then
    printf '\tLinting Successful\n\n'
    exit 0 # push will execute
else
    printf '\nPlease fix eslint before you can push this code\n\n'
    exit 1 # push will not execute
fi
