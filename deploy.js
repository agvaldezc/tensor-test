/** ---------------------------------------------------------------------------- */
/** Library imports */
const { execSync, exec } = require('child_process');
const encrypter = require('crypto-js');

/** Environment constants */
const localAppRepoUrl = 'C:\\Users\\a.valdez\\Documents\\tensor-test';
const localStylesRepoUrl = 'C:\\Users\\a.valdez\\Documents\\Sprint\\prepaid-frontend-styles';

const aemLocalRepoUrl = 'C:\\Users\\a.valdez\\Documents\\tensor-test';
const aemLocalRepoJsLibsUrl = 'C:\\Users\\a.valdez\\Documents\\tensor-test\\test';
const aemLocalRepoStyleLibsUrl = 'C:\\Users\\a.valdez\\Documents\\tensor-test\\test';

/** Target branch for Pull Request */
const baseBranch = 'master';

/** Setup variable to build styles */
const shouldBuildStyles = process.argv.some((argument) => argument === '--styles');

/** Generate buld branch hash to identify when the build was done */
const today = new Date();
const todayHash = encrypter.SHA256(today.toISOString()).toString();

/** Temp build branch */
const buildBranch = `build/${todayHash}`;
/** ---------------------------------------------------------------------------- */

/** -------------------- Function Declaration and setup ------------------------ */
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
                if (command.directory) {
                    execSync(command.cmd, {cwd: command.directory}, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`${command} failed with error output: ${error}`);
                            encounterRunError = true;
                            return;
                        }
                        console.log(`${command} ran successfully with output: ${stdout}`);
                    });
                } else {
                    execSync(command.cmd, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`${command} failed with error output: ${error}`);
                            encounterRunError = true;
                            return;
                        }
                        console.log(`${command} ran successfully with output: ${stdout}`);
                    });
                }
            }
        break;
        case 'async':
        for (let command of commandArray) {
            if (command.directory) {
                exec(command.cmd, {cwd: command.directory}, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`${command} failed with error output: ${error}`);
                        encounterRunError = true;
                        return;
                    }
                    console.log(`${command} ran successfully with output: ${stdout}`);
                });
            } else {
                exec(command.cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`${command} failed with error output: ${error}`);
                        encounterRunError = true;
                        return;
                    }
                    console.log(`${command} ran successfully with output: ${stdout}`);
                });
            }
        }
        break;
    }
}

function branchingTask() {
    console.log('Starting Git Branching Task')
    const commands = [
        { cmd: `git checkout ${baseBranch}`, directory: aemLocalRepoUrl },
        { cmd: `git checkout -b ${buildBranch}`, directory: aemLocalRepoUrl }
    ];

    console.log(`Temp build branch is ${buildBranch}`);
    runBatchCommands(commands, 'sync');
}

function commitTask() {
    console.log('Starting Git Commit Task')
    /** Git commands to be executed */
    const commands = [
        { cmd: `git add .`, directory: aemLocalRepoUrl },
        { cmd: `git commit -m "Build done on ${today}"`, directory: aemLocalRepoUrl },
        { cmd: `git push --set-upstream origin ${buildBranch}`, directory: aemLocalRepoUrl },
    ];

    runBatchCommands(commands, 'sync');
}

function stylesBuildTask() {
    console.log('Starting Styles Build Task')
    /** Commands to be executed */
    const commands = [
        { cmd: `nvm use 6.9.1`, directory: null },
        { cmd: `gulp --production`, directory: localStylesRepoUrl },
        { cmd: `mv ${localStylesRepoUrl + '\\dist\\styles\\main.css'} ${aemLocalRepoStyleLibsUrl}`, directory: null }
    ];

    runBatchCommands(commands, 'sync');
}

function appBuildTask() {
    console.log('Starting App Build Task')
    const commands = [
        { cmd: `nvm use 8.11.2`, directory: null },
        { cmd: `npm run build`, directory: localAppRepoUrl },
        { cmd: `mv ${localAppRepoUrl + '\\dist\\tensor-test\\main.js'} ${aemLocalRepoJsLibsUrl}`, directory: null },
        { cmd: `mv ${localAppRepoUrl + '\\dist\\tensor-test\\vendor.js'} ${aemLocalRepoJsLibsUrl}`, directory: null }
    ];

    runBatchCommands(commands, 'sync');
}
/** ---------------------------------------------------------------------------- */

/** ----------------------------- Main rutine ---------------------------------- */
branchingTask();
if (shouldBuildStyles) {
    stylesBuildTask();
}
appBuildTask();
commitTask();
/** ---------------------------------------------------------------------------- */
