// Import modules
const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const { spawn } = require("child_process");

// Constants
const router = Router();

const VIEW = {
    'Single-View': 'SV',
    'Multi-View': 'MV'
}

// Routes
router.post('/run_pathway_analysis/:jobID/:runId', async (req, res) => {

    // set vars
    const jobID = req.params.jobID;
    const view = VIEW[req.body.view];
    const runId = req.params.runId//1111;//(new Date()).getTime();
    const omics = Object.keys(req.body.f2id).filter(key => req.body.f2id[key]);

    // Set paths
    const myPathBase = path.join(__dirname, '../jobs', jobID)
    const myPath = path.join(myPathBase, 'PWA', view, runId.toString());
    const myPathX = path.join(myPathBase, 'EDA/xPreProcessing');
    const myPathPI = path.join(__dirname, '../scripts/py/PathIntegrate');


    // Check if folder exist
    const fileExists = async path => !!(await fs.promises.stat(path).catch(e => false));
    if (await fileExists(myPath)) {
        res.json({ status: 'Job exist', runId: runId });
        return;
    }

    // Create working folder
    await new Promise(resolve => {
        fs.mkdir(myPath, {}, () => resolve(0))
    });

    // Write f2id
    await new Promise(r => {
        Promise.all(omics.map(o => {
            return new Promise(r => {
                fs.writeFile(
                    path.join(myPath, `${o}2id.json`),
                    JSON.stringify(req.body.f2id[o]),
                    () => r(0)
                );

            })
        })).then((e) => r(0))
    });

    // Create and write params.json
    const params = {
        "mdata": path.join(myPathX, 'mdata.json'),
        "col": req.body.col,
        "type": req.body.type,
        "val1": req.body.val1,
        "val2": req.body.val2,
        "xi": omics.reduce(
            (prev, curr) => ({ ...prev, [curr]: path.join(myPathX, `x${curr}_norm.json`) }), {}
        ),
        "f2id": omics.reduce(
            (prev, curr) => ({ ...prev, [curr]: path.join(myPath, `${curr}2id.json`) }), {}
        ),
        "index": path.join(myPathX, 'index.json'),
        "gmt": path.join(myPathPI, 'Reactome_db', `Reactome_${req.body.OS}_pathways_multiomics_R89.gmt`),
        "n_components": 5,
        "output": myPath
    }
    await new Promise(r => {
        fs.writeFile(
            path.join(myPath, 'params.json'),
            JSON.stringify(params),
            () => r(0)
        );
    });

    // Run PathIntegrate
    const process = spawn(
        global.pythonPathIntegrate,
        [
            path.join(myPathPI, `PathIntegrate_${view}.py`),
            `--params=${path.join(myPath, 'params.json')}`
        ]
    );

    process.stdout.on('data', data => fs.appendFileSync(
        path.join(myPath, '.log'), `stdout: ${data}`
    ));
    process.stderr.on('data', data => fs.appendFileSync(
        path.join(myPath, '.log'), `stderr: ${data}`
    ));
    process.on('close', code => {
        if (code == 0) {
            console.log('PathIntegrate executed successfully');
        } else {
            fs.writeFile(
                path.join(myPath, 'error.log'), JSON.stringify({ status: 'error' }), () => { }
            );
        }
    })

    // Send response
    res.json({ status: 'Job sent', runId: runId });

});

// Export
module.exports = router;