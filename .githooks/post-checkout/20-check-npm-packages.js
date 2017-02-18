#!/usr/bin/env node

/* eslint-disable no-console */
const exec = require('child_process').exec,
    fs = require('fs'),
    packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')),
    dependenciesPackages = Object.keys(packageJson.dependencies),
    devDependenciesPackages = Object.keys(packageJson.devDependencies),
    allNpmPackages = dependenciesPackages.concat(devDependenciesPackages);

// Checking if any packages are missing
return new Promise((resolve) => {
    for (const [idx, npmPackage] of allNpmPackages.entries()) {
        fs.readFile(`node_modules/${npmPackage}/package.json`, 'utf8', function(err) {
            if (err && err.code === 'ENOENT') {
                resolve(true);
            } else if (idx === allNpmPackages.length - 1) {
                resolve(false);
            }
        });
    }
})
// If packages are missing then run npm install
.then((isMissingPackages) => {
    if (isMissingPackages) {
        console.log('\nHello, you are missing some packages so we are going to install them....');
        exec('npm install', (error, stdout) => {
            console.log(stdout);
        });
    }
});
