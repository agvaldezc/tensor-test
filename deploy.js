/** Library imports */
const { execSync, exec } = require('child_process');
const encrypter = require('crypto-js');

/** Environment constants */
const localBuildUrl = './dist/tensor-test';
const destinationUrl = './test';
const args = process.argv;
const baseBranch = 'master';

/** Generate buld branch hash to identify when the build was done */
const today = new Date().toISOString();
const todayHash = encrypter.SHA256(today).toString();

const buildBranchName = `build/${todayHash}`;

/** Build File Replacement commands */
const fileReplacementCommands = [
    `mv ${localBuildUrl + '/main.js'} ${destinationUrl + '/main.js'}`,
    `mv ${localBuildUrl + '/vendor.js'} ${destinationUrl + '/vendor.js'}`,
];

/** Git pipeline commands */
const gitCommands = [
    `git checkout ${baseBranch}`,
    `git checkout -b ${buildBranchName}`,
    `git add .`,
    `git commit -m "test commit"`,
    `git push --set-upstream origin ${buildBranchName}`
];

/**
 * Run a batch of console commands choosing the type of execution wanted for them.
 * @param {string[]} commandArray Array of string console commands to execute.
 * @param {string} executionType Type of execution 'sync' for sequential, 'async' for parallel.
 */
function runBatchCommands(commandArray, executionType) {
    console.log(`***** Batch command execution started *****`)
    switch (executionType) {
        case 'sync':
            for (let command of commandArray) {
                execSync(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`${command} failed with error output: ${error}`);
                        return;
                    }
                    console.log(`${command} ran successfully with output: ${stdout}`);
                });
            }
        break;
        case 'async':
            for (let command of commandArray) {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`${command} failed with error output: ${error}`);
                        return;
                    }
                    console.log(`${command} ran successfully with output: ${stdout}`);
                });
            }
        break;
    }
}

/** Execution of tasks */
console.log(`Temp build branch is ${buildBranchName} with hash ${todayHash}`);
runBatchCommands(fileReplacementCommands, 'sync');
runBatchCommands(gitCommands, 'sync');