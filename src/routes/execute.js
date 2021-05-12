// Import modules
const express = require("express");
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');
const importPartials = require(path.join(__dirname, '../lib/importPartials.js'));
const importValues = require(path.join(__dirname, '../lib/importValues.js'));
const runWorkflow = require(path.join(__dirname, '../lib/runWorkflow.js'));
const makeid = require(path.join(__dirname, '../lib/makeid.js'));
const execTime = require(path.join(__dirname, '../lib/execTime.js'));
const { checkJobStatus } = require(path.join(__dirname, 'lib/checkJobStatus.js'));

// Global variables
var views = path.join(__dirname, '../views');
var router = express.Router();

// Workflow is sent from client...
router.post('/execute', (req, res) => {

    // create workflow ID
    let workflowID = makeid(5);

    // handle post request
    const form = formidable({ multiples: true });
    
    form.parse(req, async (err, fields, files) => {

        if (err) {
            next(err);
            return;
        }

        // run workflow
        msg = await runWorkflow(JSON.parse(fields.iniInput), files, workflowID);
        console.log(msg);

        // redirect to /execute/:id...
        res.redirect(`execute/${workflowID}`);
    })

})


// It is asked for a job from client...
router.get('/execute/:id', async (req, res) => { 
    
    // job folder of the requested job
    let jobFolder = path.join(__dirname, '../public/jobs', req.params.id);

    // check job status and send the corresponding response
    let { status, errorInfo } = await checkJobStatus (req.params.id);

    // UNKNOWN
    if (status == 'UNKNOWN')
    {
        // read html view and import partials
        let html = importPartials(fs.readFileSync(path.join(views, "error.html"), "utf-8"));

        // import values
        html = importValues(html, {
            "<!-- INSERT VALUE: code -->": `${errorInfo.code}`,
            "<!-- INSERT VALUE: errorLocation -->": `${errorInfo.module}`,
            "<!-- INSERT VALUE: errorDescription -->": `${errorInfo.description}`
        })

        // send complete html
        res.send(html);
        return;
    }

    // FAILED
    if (status == 'FAILED')
    {
        // read html view and import partials
        let html = importPartials(fs.readFileSync(path.join(views, "error.html"), "utf-8"));

        // import values
        html = importValues(html, {
            "<!-- INSERT VALUE: code -->": `${errorInfo.code}`,
            "<!-- INSERT VALUE: errorLocation -->": `${errorInfo.module}`,
            "<!-- INSERT VALUE: errorDescription -->": `${errorInfo.description}`
        })

        // send complete html
        res.send(html);
        return;
    }

    // READY
    if (status == "READY")
    {
        // read html view and import partials
        let html = fs.readFileSync(path.join(views, "loading.html"), "utf-8");

        // import values
        html = importValues(html, {
            "/* INSERT VALUE: workflowID */": `${req.params.id}`,
            "/* INSERT VALUE: status */": "Finished",
            "<!-- INSERT VALUE: partialButton -->": "<!-- INSERT PARTIAL: execute/downloadButton.html -->",
            "<!-- INSERT VALUE: reload.js -->": `<script type='text/javascript' src='${path.join('/assets/js/reload.js')}'></script>`,
            "/* INSERT VALUE: execTime */": execTime(fs.statSync(jobFolder).atimeMs,
                fs.statSync(path.join(jobFolder, 'TurboPutative_results.zip')).atimeMs)
        });

        html = importPartials(html);

        html = importValues(html, {
            "/* INSERT VALUE: linkToZip */": `${path.join('/jobs/', req.params.id, 'TurboPutative_results.zip')}`
        })

        // send complete html
        res.send(html);
        return;
    }

    // WAITING
    if (status == 'WAITING')
    {
        // read html view and import partials
        let html = importPartials(fs.readFileSync(path.join(views, "loading.html"), "utf-8"));

        // import values
        html = importValues(html, {
            "/* INSERT VALUE: workflowID */": `${req.params.id}`,
            "/* INSERT VALUE: status */": "Running",
            "<!-- INSERT VALUE: reload.js -->": `<script type='text/javascript' src='${path.join('/assets/js/reload.js')}'></script>`,
            "/* INSERT VALUE: execTime */": execTime(fs.statSync(jobFolder).atimeMs, new Date().getTime())
        });

        // send complete html
        res.send(html);
        return;
    }

    return;
})

// Export Route
module.exports = router;