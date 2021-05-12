// AÑADIR POST PARA CONSULTAR TRABAJO Y DESCARGARLO LLEGADO EL CASO (sendFile??)
// PASAR FUNCIONES A FICHERO A PARTE
// PROBAR A ENVIAR POST DESDE PYTHON (MIRA UNIPROT Y OTRAS PARA VER CÓMO LO EXPLICAN)
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

const { parseRequest, checkModuleParameters, INIStringGenerator } = require(path.join(__dirname, 'lib/apiUtilities.js'));
const { checkJobStatus } = require(path.join(__dirname, 'lib/checkJobStatus.js'));
const makeid = require(path.join(__dirname, '../lib/makeid.js'));
const runWorkflow = require(path.join(__dirname, '../lib/runWorkflow.js'));

// Intantiate Router
const router = Router();

// Define api routes
router.post('/api/execute', async (req, res) => {
    // route to execute workflow
    console.log('**');
    console.log("** Received POST request to execute workflow");

    // parse request
    let FilesAndFields = await parseRequest(req, res, 'FULL');
    if (!FilesAndFields) return;
    console.log('** Request was parsed using formidable');

    // check modules given
    console.log('** Assert that modules given are correct');
    const modulesSchema = Joi.object({

        "modules": Joi.array().items(
            Joi.string().valid("Tagger"),
            Joi.string().valid("REname"),
            Joi.string().valid("RowMerger"),
            Joi.string().valid("TableMerger")
            ).min(1).unique().required(),

        "settings": Joi.object().required()
    });

    let validation = modulesSchema.validate(FilesAndFields.parameters);
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    // check if parameters of each module are ok
    console.log('** Checking settings object sent for each module')
    selectedModules = FilesAndFields.parameters.modules;

    for (let i=0; i<selectedModules.length; i++) {
        let validationError = await checkModuleParameters(selectedModules[i], FilesAndFields.parameters.settings)
        
        if (validationError) {
            console.log(`** Error in ${selectedModules[i]} settings format`);
            res.status(400).send(validationError.details[0].message);
            return;
        }
    }

    // check if tm_table was sent in case TableMerger was selected
    let featInfoFile = FilesAndFields.files.featInfoFile;
    if (selectedModules.includes('TableMerger') && (featInfoFile == undefined || featInfoFile.size == 0)) {
        res.status(400).send("File with feature information used by TableMerger is required");
        return;
    }

    // create string with ini content that will be printed in the configUser.ini file
    let iniString = await INIStringGenerator (FilesAndFields.parameters.settings);

    // generate workflowID and an object with configUser.ini used by runWorkflow
    let parametersRW = { "configUser": iniString, "modules": selectedModules };
    let workflowID = makeid(5);
    console.log(`** Workflow ID: ${workflowID}`);

    // RUN WORKFLOW
    msg = await runWorkflow(parametersRW, FilesAndFields.files, workflowID);
    console.log(`** ${msg}`);

    // send json with workflowID
    res.json({ job_id: workflowID });

    return;
})

// route to run a specific module
router.post('/api/:module', async (req, res) => {

    let module = req.params.module.toUpperCase();

    console.log('**');
    console.log(`** Received POST request to run ${module}`);

    // parse request to get files and parameters
    let FilesAndFields = await parseRequest(req, res, module);
    if (!FilesAndFields) return;
    console.log('** Request was parsed using formidable');

    res.json(FilesAndFields);

    return;
})

// route to get results from job id
router.get('/api/status/:job_id', async (req, res) => {

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
        jobInfo.downloadURL = `http://${req.headers.host}/jobs/${req.params.job_id}/TurboPutative_results.zip`;
        res.json(jobInfo);
        //res.download(path.join(jobFolder, "TurboPutative_results.zip"));
        return;
    }

    // WAITING
    if (status == 'WAITING')
    {
        res.json(jobInfo);
        return;
    }

    return;
})

// Export Router
module.exports = router;