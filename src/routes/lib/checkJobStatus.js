const fs = require('fs');
const path = require('path');


/*
The function will be resolved with different values
depending on the job status.

Status code:
    - 'UNKNOWN'
    - 'WAITING'
    - 'READY'
    - 'FAILED'

*/
function checkJobStatus (jobID) {

    return new Promise (resolve => {

        // returned object when resolving promise
        jobInfo = {
            'status': undefined,
            'errorInfo': {
                'code': undefined,
                //'module': undefined,
                'description': undefined
            }
        }

        // path to requested job
        let jobFolder = path.join(__dirname, '../../public/jobs/', jobID);

        // job not found
        if (!fs.existsSync(jobFolder)) 
        {
            console.log (`** The requested job (${jobID}) was not found`);

            jobInfo.status = 'UNKNOWN';
            jobInfo.errorInfo.code = 51;
            jobInfo.errorInfo.module = 'search';
            jobInfo.errorInfo.msg = 'Error: The requested job was not found';

            resolve (jobInfo);
            return;
        }

        // job found
        if (fs.existsSync(jobFolder))
        {    
            console.log (`** The requested job folder (${jobID}) does exist`);

            // failed
            let errorExist = fs.existsSync(path.join(jobFolder, 'error.log'));
            if (errorExist)
            {
                //let codeError = fs.readFileSync(path.join(jobFolder, 'error.log'), 'utf-8').replace(/\r?\n/g, '');
                let errorInfo = JSON.parse(fs.readFileSync(path.join(jobFolder, 'error.log')));
                console.log(`** An error occurred during the execution of the requested job (${jobID}):`);
                console.log(`${JSON.stringify(errorInfo)}`);
                
                jobInfo.status = 'FAILED';
                jobInfo.errorInfo = errorInfo;

                //jobInfo.errorInfo = getErrorInfo (codeError);

                resolve (jobInfo);
                return;
            }

            // ready
            let resultExist = fs.existsSync(path.join(jobFolder, 'TurboPutative_results.zip'));
            if (resultExist)
            {
                console.log (`** TurboPutative_results.zip file does exist. Sending results.`);

                jobInfo.status = 'READY';

                resolve(jobInfo);
                return;
            }

            // waiting
            if (!errorExist && !resultExist)
            {
                jobInfo.status = global.processManager.status (jobID);
                console.log (`** status (${jobID}): ${jobInfo.status}`);

                resolve (jobInfo);
                return;
            }
        }
    })
}

function getErrorInfo (errorCode) {

    // read errorCode.json
    let codeErrorJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../TurboPutative-2.0-built/errorCode.json'), 'utf-8')
        );

    // if error is not in errorCode.json, write NA
    let errorCodeChecked = Object.keys(codeErrorJSON).includes(errorCode) ? errorCode : "NA";
    
    // error information
    let errorInfo = {
        'code': errorCode,
        'module': codeErrorJSON[errorCodeChecked]['module'],
        'description': codeErrorJSON[errorCodeChecked]['description']
    }

    return errorInfo;
}

// Export checkJobStatus function
module.exports.checkJobStatus = checkJobStatus;