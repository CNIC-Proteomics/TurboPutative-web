// Import libraries
const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Set constants
const router = express.Router();

// Routing
router.post('/run_ora/:jobID/:OS', async (req, res) => {

    // Get parameters
    const { jobID, OS } = req.params;
    const ORAinput = req.body;
    
    const oraid = Date.now().toString();

    // Set paths
    const myPath = path.join(__dirname, '../jobs', jobID, 'tmp', oraid);
    const myPathKEGG_input = path.join(myPath, `KEGG_input_${oraid}.json`);
    const myPathKEGG_output = path.join(myPath, `KEGG_output_${oraid}.json`);
    const myPathChEBI_input = path.join(myPath, `ChEBI_input_${oraid}.json`);
    const myPathChEBI_output = path.join(myPath, `ChEBI_output_${oraid}.json`);

    // Get .gmt KEGG path
    let keggOS = OS.split(' ').map((e, i) => i == 0 ? e.slice(0, 1).toLowerCase() : e.slice(0, 2)).join('');
    keggOS = `RBR_KEGG_${keggOS}_pathways_compounds_R110.gmt`;

    let myPathKEGG_gmt = path.join(__dirname, '../scripts/data/kegg_metabolomics');
    myPathKEGG_gmt = fs.existsSync(path.join(myPathKEGG_gmt, keggOS)) ?
        path.join(myPathKEGG_gmt, keggOS) : path.join(myPathKEGG_gmt, `RBR_KEGG_hsa_pathways_compounds_R110.gmt`);

    // Get .gmt REACTOME path
    let reacOS = OS.replace(' ', '_');
    reacOS = `RBR_Reactome_${reacOS}_pathways_ChEBI_R89.gmt`;

    let myPathREAC_gmt = path.join(__dirname, '../scripts/data/reactome_metabolomics');
    myPathREAC_gmt = fs.existsSync(path.join(myPathREAC_gmt, reacOS)) ?
        path.join(myPathREAC_gmt, reacOS) : path.join(myPathREAC_gmt, `RBR_Reactome_Homo_sapiens_pathways_ChEBI_R89.gmt`);

    // Create working path
    if (!fs.existsSync(myPath)) {
        fs.mkdirSync(myPath);
    }

    // Write myORA.py input files
    const KEGGpromise = fs.writeFile(
        myPathKEGG_input,
        JSON.stringify(ORAinput.KEGG),
        () => console.log('KEGG input written')
    );

    const ChEBIpromise = fs.writeFile(
        myPathChEBI_input,
        JSON.stringify(ORAinput.ChEBI),
        () => console.log('ChEBI input written')
    );

    await new Promise(r => Promise.all([KEGGpromise, ChEBIpromise]).then(data => r(0)));

    // Run myORA
    const KEGG_ora_promise = runORA(myPathKEGG_input, myPathKEGG_output, myPathKEGG_gmt);
    const ChEBI_ora_promise = runORA(myPathChEBI_input, myPathChEBI_output, myPathREAC_gmt);

    const resORA = await new Promise(r => Promise.all([KEGG_ora_promise, ChEBI_ora_promise])
        .then(([KEGGcategories, REACTOMEcategories]) => r({ KEGG: KEGGcategories, ChEBI: REACTOMEcategories })));

    // Remove working directory
    fs.rm(myPath, { recursive: true, force: true }, () => {console.log('removing directory') });

    res.json(resORA);

});

// Local functions
const runORA = (infile, outfile, gmt) => {
    return new Promise((resolve, reject) => {

        const process = spawn(
            global.pythonPath,
            [
                path.join(__dirname, '../scripts/py/myORA.py'),
                `--infile=${infile}`,
                `--outfile=${outfile}`,
                `--gmt=${gmt}`
            ]
        );

        process.stdout.on('data', data => fs.appendFileSync(
            path.join(infile.replace(/\.[^/.]+$/, ".log")),
            `stdout: ${data}`
        ));

        process.stderr.on('data', data => fs.appendFileSync(
            path.join(infile.replace(/\.[^/.]+$/, ".log")),
            `stderr: ${data}`
        ));

        process.on('close', code => {
            if (code == 0) {
                fs.readFile(
                    outfile,
                    (err, data) => resolve(JSON.parse(data))
                );
            } else {
                console.log(`Error running myORA.py with ${infile}`);
                resolve([]);
            }
        });

    });
}

// Export
module.exports = router;