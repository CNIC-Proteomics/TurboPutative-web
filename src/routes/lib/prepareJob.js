//
// Create job folder with files used in the execution
//
const path = require ('path');
const fs = require ('fs');
//const math = require('math');

prepareJob = function (parameters, files, workflowID, IP) {

    return new Promise (resolve => {

        // create folder containing job
        console.log(`** Creating folder for job ${workflowID}`);
        let jobFolder = path.join(__dirname, '../../public/jobs/', workflowID);
        fs.mkdirSync(jobFolder);
        fs.writeFileSync(path.join(jobFolder, "timer"), "timer");

        // create configUser (C++ version) with all parameters
        fs.writeFileSync(path.join(jobFolder, "configUser.ini"), parameters.configUser);

        // check that client (IP) does not exceed maximum number of jobs
        if (global.processManager.IPexceed(IP))
        {
            msg = `Client exceeded maximum number of WAITING jobs (${global.processManager.MAX_WAITING_PROCESS})`;
            fs.writeFileSync(path.join(jobFolder, 'error.log'), `{"code": "999", "msg": "${msg}"}`);
            console.log (`** ERROR: ${msg}`);
            resolve(workflowID);
            return;
        }

        // Check that files do not exceed MAXIMUM SIZE
        let MAXSIZE = 100 * Math.pow(10, 6);

        if (files.infile.size > MAXSIZE)
        {
            let msg = `${files.infile.name} exceeded maximum size allowed (100MB)`;
            fs.writeFileSync(path.join(jobFolder, 'error.log'), `{"code": "999", "msg": "${msg}"}`);
            console.log (`** ERROR: ${msg}`);
            resolve(workflowID);
            return;
        }

        if (files.featInfoFile !== undefined && files.featInfoFile.size > MAXSIZE)
        {
            let msg = `${files.featInfoFile.name} exceeded maximum size allowed (100MB)`;
            fs.writeFileSync(path.join(jobFolder, 'error.log'), `{"code": "999", "msg": ${msg}}`);
            console.log (`** ERROR: ${msg}`);
            resolve(workflowID);
            return;
        }

        // move files to jobFolder

            // infile
        console.log(`** Copying infile to ${jobFolder}`);
        fs.copyFileSync(files.infile.path, path.join(jobFolder, files.infile.name));

            // featinfo file
        if (parameters.modules.includes("TableMerger")) {
            console.log(`** Copying feature information filo to ${jobFolder}`)
            
            if (files.featInfoFile.size == 0) {
                let msg = `File with feature information has size 0 (it may not be uploaded)`
                fs.writeFileSync(path.join(jobFolder, 'error.log'), `{"code": "999", "msg": "${msg}"}`);
                console.log(`** ERROR: ${msg}`);
                return;

            } else {
                fs.copyFileSync(files.featInfoFile.path, path.join(jobFolder, files.featInfoFile.name));
            }
        }

            // regex.ini file
        if (parameters.modules.includes("REname")) {
            console.log(`** Copying regex.ini to ${jobFolder}`);
            console.log(`** Using default regex.ini`);
            fs.copyFileSync(path.join(__dirname, '../../TurboPutative-2.0-built/TPProcesser/REname/data/regex.ini'), path.join(jobFolder, 'regex.ini'));

            // User cannot send regex (at least by now)
            /*
            if (files.regexFile.size == 0) {
                console.log(`** Using default regex.ini`);
                fs.copyFileSync(path.join(__dirname, '../../TurboPutative-2.0-built/TPProcesser/REname/data/regex.ini'), path.join(jobFolder, 'regex.ini'));
            } else {
                console.log(`** Using regex.ini given by the user`); 
                fs.copyFileSync(files.regexFile.path, path.join(jobFolder, 'regex.ini'));
            }
            */

        }

        // Get modules
        let tmTableName = "";
        let workflowParam = "";
        for (let i=0; i<parameters.modules.length; i++) {
            switch (parameters.modules[i]) {
                case "Tagger":
                    workflowParam += '1';
                    break;
                
                case "REname":
                    workflowParam += '2';
                    break;
                
                case "RowMerger":
                    workflowParam += '3';
                    break;
                
                case "TableMerger":
                    workflowParam += '4';
                    tmTableName = files.featInfoFile.name;
                    break;

                case "TPMetrics":
                    workflowParam += '5';
                    break;

                case "TPFilter":
                    workflowParam += '6';
                    break;
            }
            
        }

        // Send job to waiting
        global.processManager.addProcess({
            'IP': IP,
            'jobID': workflowID, 
            'modules': workflowParam,
            'msTableName': files.infile.name,
            'tmTableName': tmTableName
        });

        resolve (workflowID);
        return;
    })

}

// Export function
module.exports = prepareJob;