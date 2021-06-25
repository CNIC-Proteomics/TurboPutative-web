// AÑADIR NUEVAS POST:
    // MODULOS INDEPENDIENTES
        // Crear función 'check' que haga las comprobaciones de los módulos y parámetros (común a todos)
        // Adaptar función parseRequest para que pueda funcionar con los nuevos POST, incluso por defecto
    // DEVOLVER COMPUESTOS TRANSFORMADOS (¿SCRIPT A PARTE?)

// Import libraries
const path = require("path");
const fs = require("fs");
const { Router } = require('express');
const formidable = require('formidable');
const Joi = require('joi');

const { parseRequest, INIStringGenerator, checkRequest } = require(path.join(__dirname, 'lib/apiExecuteUtilities.js'));
const { checkJobStatus } = require(path.join(__dirname, 'lib/checkJobStatus.js'));
const makeid = require(path.join(__dirname, '../lib/makeid.js'));
const prepareJob = require(path.join(__dirname, './lib/prepareJob.js'));

// Intantiate Router
const router = Router();

// Define api routes
router.post('/api/execute', async (req, res) => {

    // route to execute workflow
    let IP = req.ip;
    console.log('**');
    console.log(`** Received POST request to execute workflow: ${IP}`);

    // parse request
    let FilesAndFields = await parseRequest(req, res, 'FULL');
    if (!FilesAndFields) return;
    console.log('** Request was parsed using formidable');

    // apply checks
    let checking = await checkRequest (res, FilesAndFields);
    if (! checking) return;

    // create string with ini content that will be printed in the configUser.ini file
    let iniString = await INIStringGenerator (FilesAndFields.parameters.settings);

    // generate workflowID and an object with configUser.ini used by runWorkflow
    let parametersRW = { "configUser": iniString, "modules": FilesAndFields.parameters.modules };

    // PREPARE JOB
    let workflowID = makeid(5);
    console.log(`** Workflow ID: ${workflowID}`);
    
    await prepareJob(parametersRW, FilesAndFields.files, workflowID, IP);
    //console.log(`** ${jobObject}`);

    // send json with workflowID
    res.json({ job_id: workflowID });

    return;
})

// route to run a specific module
router.post('/api/execute/:module', async (req, res) => {

    let module = req.params.module.toUpperCase();
    
    // check if the requested module does exist
    if (!['TAGGER', 'RENAME', 'ROWMERGER', 'TABLEMERGER'].includes(module))
    {
        res.status(404).json({'error': `${req.params.module} module does not exist`});
        return;
    }

    let IP = req.ip;
    console.log('**');
    console.log(`** Received POST request to run ${module}: ${IP}`);

    // parse request to get files and parameters
    let FilesAndFields = await parseRequest(req, res, module);
    if (!FilesAndFields) return;
    console.log('** Request was parsed using formidable');

    // apply checks
    let checking = await checkRequest (res, FilesAndFields);
    if (! checking) return;    

    // create string with ini content that will be printed in the configUser.ini file
    let iniString = await INIStringGenerator (FilesAndFields.parameters.settings);

    // generate workflowID and an object with configUser.ini used by runWorkflow
    let parametersRW = { "configUser": iniString, "modules": FilesAndFields.parameters.modules };

    // RUN WORKFLOW
    let workflowID = makeid(5);
    console.log(`** Workflow ID: ${workflowID}`);
    await prepareJob(parametersRW, FilesAndFields.files, workflowID, IP);
    //console.log(`** ${jobObject}`);

    // send json with workflowID
    res.json({ job_id: workflowID });

    return;
})

// route to get results from job id
router.get('/api/execute/status/:job_id', async (req, res) => {

    // the response will always be a json with job information
    let jobInfo = {
        job_id: req.params.job_id,
        status: undefined
        // errorInfo: {} --> if FAILED
        // downloadURL: 'http://localhost:8080/jobs/job_id/TurboPutative_results.zip' --> if READY
    }

    // job folder of the requested job
    let jobFolder = path.join(__dirname, '../public/jobs', req.params.job_id);

    // check job status and send the corresponding response
    let { status, errorInfo } = await checkJobStatus (req.params.job_id);
    jobInfo.status = status;

    // depending on the status, send an appropiate response

    // UNKNOWN
    if (status == 'UNKNOWN')
    {
        res.status(404).json(jobInfo);
        return;
    }

    // FAILED
    if (status == 'FAILED')
    {
        jobInfo.errorInfo = errorInfo;
        res.json(jobInfo);
        return;
    }

    // READY
    if (status == "READY")
    {
        /*jobInfo.downloadURL = `http://${req.headers.host}/jobs/${req.params.job_id}/TurboPutative_results.zip`;*/
        res.json(jobInfo);
        //res.download(path.join(jobFolder, "TurboPutative_results.zip"));
        return;
    }

    // WAITING
    if (status == 'WAITING' || status == 'RUNNING')
    {
        res.json(jobInfo);
        return;
    }

    return;
})


// route to download results
router.get('/results/:job_id', (req, res) => {

    console.log (`** Sending job results: ${req.params.job_id}`);

    // check if folder exist
    let jobFolder = path.join(__dirname, `../public/jobs/${req.params.job_id}`);
    if (! fs.existsSync(jobFolder))
    {
        console.log (`** Requested job (${req.params.job_id}) does not exist`);
        res.status(404).json({'error': 'Requested job does not exist'});
        return;
    }

    // check if zip exist
    let jobResults = path.join(jobFolder, 'TurboPutative_results.zip');
    if (! fs.existsSync(jobResults))
    {
        console.log(`** Requested job results (${req.params.job_id}) are not available (job exists, but it failed or it is waiting)`);
        res.status(404).json({'error': 'Requested job is not available'});
        return
    }
    
    res.download(jobResults);
    return;

})

// Export Router
module.exports = router;