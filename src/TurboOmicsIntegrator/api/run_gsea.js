// Import modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");


// Constants
const router = express.Router();

// Routes
router.post('/run_gsea/:jobID/:omic/:gseaID/:os', async (req, res) => {

    const { omic, jobID, gseaID, os } = req.params;
    const gseaData = req.body;

    // Set working path
    const myPath = path.join(__dirname, '../jobs', jobID, 'GSEA', omic, gseaID);

    // Check if gseaID exists
    const existGseaId = await new Promise(resolve => {
        fs.access(myPath, (err) => { resolve(!err) })
    });

    // If exists send it
    /*if (existGseaId) {
        res.json({ status: 'exists' });
        return;
    }*/

    // Write working path
    await new Promise(resolve => {
        fs.mkdir(myPath, {}, () => resolve(0))
    });

    // Write GSEA input
    await new Promise(resolve => {
        fs.writeFile(
            path.join(myPath, 'EID_GN_RankStat.json'),
            JSON.stringify(gseaData), 'utf-8',
            () => resolve(0)
        );
    });

    // Run GSEA script
    const myGseaPath = path.join(__dirname, '../scripts/R/myGSEA');
    const exec = [
        path.join(myGseaPath, 'myGSEA.R'),
        myGseaPath,
        myPath,
        os
    ];

    const process = spawn(
        global.RPath,
        exec,
        { encoding: 'utf-8' }
    );

    process.stdout.on('data', data => fs.appendFileSync(
        path.join(myPath, `.log`), `stdout: ${data}`)
    );

    process.stderr.on('data', data => fs.appendFileSync(
        path.join(myPath, `.log`), `stderr: ${data}`)
    );

    process.on('close', code => {
        if (code == 0) {
            console.log(`GSEA executed successfully on ${omic}`);
        } else {
            fs.appendFileSync(
                path.join(myPath, `error.log`), JSON.stringify({ status: 'error' })
            );
            console.log(`GSEA Error on ${omic}`);
        }
    })

    res.json({ status: 'running' });

});

router.post('/run_mummichog/:jobID/:omic/:gseaID/:os', async (req, res) => {

    const { jobID, omic, gseaID, os } = req.params;
    const gseaData = req.body;

    // Set working path
    const myPath = path.join(__dirname, '../jobs', jobID, 'GSEA', omic, gseaID);

    // Check if gseaID exists
    const existGseaId = await new Promise(resolve => {
        fs.access(myPath, (err) => { resolve(!err) })
    });

    // If exists send it
    /*if (existGseaId) {
        res.json({ status: 'exists' });
        return;
    }*/

    // Write working path
    await new Promise(resolve => {
        fs.mkdir(myPath, {}, () => resolve(0))
    });

    // 
    const myPromises = Object.keys(gseaData).map(mode => {
        return new Promise(async resolve => {

            // set path for mode
            const myPathMode = path.join(myPath, mode);

            // create mode folder
            await new Promise(r => fs.mkdir(myPathMode, () => r(0)));

            // write infile.tsv
            const infilePath = path.join(myPathMode, 'infile.tsv');
            await new Promise(r => fs.writeFile(infilePath, gseaData[mode], () => r(0)));

            // Execute mummichog
            const exec = [
                '-m', 'mummichog.main',
                `--infile=${infilePath}`,
                `--output=results`,
                `--workdir=${myPathMode}`,
                `--mode=${ mode == 'pos' ? 'positive' : 'negative'}`,
                `--permutation=100`,
                `-c`, `0.1`
            ];

            const process = spawn(
                global.pythonPath,
                exec,
                { encoding: 'utf-8' }
            );

            process.stdout.on('data', data => fs.appendFileSync(
                path.join(myPathMode, `.log`), `stdout: ${data}`)
            );

            process.stderr.on('data', data => fs.appendFileSync(
                path.join(myPathMode, `.log`), `stderr: ${data}`)
            );

            process.on('close', code => {
                if (code == 0) {
                    console.log(`mummichog executed successfully on ${omic}`);
                } else {
                    fs.appendFileSync(
                        path.join(myPathMode, `error.log`), JSON.stringify({ status: 'error' })
                    );
                    console.log(`mummichog Error on ${omic}`);
                }
            });

            resolve(0);

        });
    });

    await new Promise(r => Promise.all(myPromises).then((values) => r(0)));

    res.json({ status: 'running' });

});

// Export
module.exports = router;