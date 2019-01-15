/** Library imports */
const { exec } = require('child_process');
const encrypter = require('crypto-js');

/** Environment constants */
const activationLocalRepoUrl = '';
const aemLocalRepoUrl = '';
const args = process.argv;

/** Generate  */
const today = new Date().toISOString();
const todayHash = encrypter.SHA256(today);

const buildBranchName = `build/${todayHash}`;

/** Git pipeline commands */
const gitCommands = [
    `git checkout master`,
    `git checkout -b ${todayHash}`,
    `git add .`,
    `git commit -m "test commit"`,
    `git push -u ${todayHash}`
];

console.log(todayHash);

/*
exec(`mv ./dist/tensor-test/main.js ./test/main.js`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});*/

/*
exec(`git checkout master`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});

exec(`git checkout -b ${today}`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});

exec(`git add .`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});

exec(`git commit -m "test commit"`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});

exec(`git push -u ${today}`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});*/

exec(`git checkout master | git checkout -b ${today} | git add . | git commit -m "test commit" | git push -u ${today}`, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
    console.log(stderr);
});