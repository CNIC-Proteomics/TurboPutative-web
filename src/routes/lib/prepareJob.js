//
// Create job folder with files used in the execution
//
const path = require ('path');
const fs = require ('fs');

prepareJob = function (parameters, files, workflowID) {

    return new Promise (resolve => {

        // create folder containing job
        console.log(`** Creating folder for job ${workflowID}`);
        let jobFolder = path.join(__dirname, '../../public/jobs/', workflowID);
        fs.mkdirSync(jobFolder);

        // create configUser (C++ version) with all parameters
        fs.writeFileSync(path.join(jobFolder, "configUser.ini"), parameters.configUser);

        // move files to jobFolder

            // infile
        console.log(`** Copying infile to ${jobFolder}`);
        fs.copyFileSync(files.infile.path, path.join(jobFolder, files.infile.name));

            // featinfo file
        if (parameters.modules.includes("TableMerger")) {
            console.log(`** Copying feature information filo to ${jobFolder}`)
            
            if (files.featInfoFile.size == 0) {
                console.log(`File with feature information has size 0 (it may not be uploaded)`);
                fs.writeFileSync(path.join(jobFolder, 'error.log'), '50');
                return;
            } else {
                fs.copyFileSync(files.featInfoFile.path, path.join(jobFolder, files.featInfoFile.name));
            }
        }

            // regex.ini file
        if (parameters.modules.includes("REname")) {
            console.log(`** Copying regex.ini to ${jobFolder}`);

            if (files.regexFile.size == 0) {
                console.log(`** Using default regex.ini`);
                fs.copyFileSync(path.join(__dirname, '../../TurboPutative-2.0-built/TPProcesser/REname/data/regex.ini'), path.join(jobFolder, 'regex.ini'));
            } else {
                console.log(`** Using regex.ini given by the user`); 
                fs.copyFileSync(files.regexFile.path, path.join(jobFolder, 'regex.ini'));
            }

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
            }
            
        }

        // Send job to waiting
        global.processManager.addProcess({
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