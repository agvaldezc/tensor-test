/** ---------------------------------------------------------------------------- */
/** Library imports */
const { execSync, exec } = require('child_process');
const encrypter = require('crypto-js');

/** Environment constants */
const localBuildUrl = './dist/tensor-test';
const fileDestinationUrl = './test';

/** Target branch for Pull Request */
const baseBranch = 'master';

/** Version manager constants */
const bitbucketRepoUrl = 'https://code.sprintdd.com/projects/DIG-BOOST-WEB/repos/prepaid-frontend-activation';
const githubRepoUrl = 'https://github.com/agvaldezc/tensor-test';

const VERSION_MANAGER = {
    github: 'github',
    bitbucket: 'bitbucket'
};
/** Version manager to be used */
const targetVersionManager = VERSION_MANAGER.github;
let encounterRunError = false;

/** Generate buld branch hash to identify when the build was done */
const today = new Date().toISOString();
const todayHash = encrypter.SHA256(today).toString();

/** Temp build branch */
const buildBranch = `build/${todayHash}`;

/** Commands to be executed */
const commands = [
    `mv ${localBuildUrl + '/main.js'} ${fileDestinationUrl + '/main.js'}`,
    `mv ${localBuildUrl + '/vendor.js'} ${fileDestinationUrl + '/vendor.js'}`,
    `git checkout ${baseBranch}`,
    `git checkout -b ${buildBranch}`,
    `git add .`,
    `git commit -m "test commit"`,
    `git push --set-upstream origin ${buildBranch}`
];
/** ---------------------------------------------------------------------------- */

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
                        encounterRunError = true;
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

/** Execution */
console.log(`Temp build branch is ${buildBranch}`);
runBatchCommands(commands, 'sync');

if (encounterRunError) {
    console.error(`No Pull Request link generated because error was encoutered during script execution.`)
} else {
    let pullRequestUrl = null;

    switch (targetVersionManager) {
        case VERSION_MANAGER.bitbucket:
        pullRequestUrl = `${bitbucketRepoUrl}/pull-requests?create&targetBranch=refs%2Fheads%2F${baseBranch}&sourceBranch=refs%2Fheads%2F${buildBranch}`;
        break;
        case VERSION_MANAGER.github:
        pullRequestUrl = `${githubRepoUrl}/compare/${baseBranch}...${buildBranch}`;
        break;
    }
    console.log(`Pull Request link for ${targetVersionManager} generated: ${pullRequestUrl}`);
}