//
// Function used to run workflow. This function will be used by ProcessManager object
//
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

runJob = function (jobObject) {

    console.log(`** Run workflow: ${jobObject}`);

    // base script
    let script = `python "./src/TurboPutative-2.0-built/TPWrapper.py"`;

    // job folder path
    let jobFolder = path.join(__dirname, '../../public/jobs', jobObject.jobID);

    // tmTable
    let tmTable = jobObject.tmTableName == "" ? jobObject.tmTableName : `-tm "${jobObject.tmTableName}"`;

    // build full command
    let fullCommand = `${script} -wd "${jobFolder}" -wf ${jobObject.modules} -i "${jobObject.msTableName}" ${tmTable}`;
    
    console.log(`** Executing workflow: ${fullCommand}`);
    
    // execute workflow
    global.processManager.running.push(jobObject);
    exec(fullCommand, (error, stdout, stderr) => {

        if (error) {
            console.error(`exec error: ${error}`);
            fs.writeFileSync(path.join(jobFolder, 'error.log'), error.code);
            global.processManager.completed (jobObject.jobID);
            return;
        }

        fs.writeFileSync(path.join(jobFolder, 'log.info'), `stdout:\n${stdout}\nstderr:\n${stderr}`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        console.log(`Finished workflow execution: ${jobObject.jobID}`);
        global.processManager.completed (jobObject.jobID);
    });

    return;
}

// Export function
module.exports = runJob