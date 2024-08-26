// Import libraries
const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const multer = require('multer');

// Constants
const router = Router();
const upload = multer({ dest: path.join(`${__dirname}`, '/../jobs/_tmp') });

const OMICNAMES = [
    ['Proteomics', 'q'],
    ['Transcriptomics', 't'],
    ['Metabolomics', 'm']
];

// Routes
router.post(
    '/extract_multi_assay_experiment/:maeid',
    upload.single('my_file'),
    async (req, res) => {

        //set constants
        const fileInfo = req.file;
        const maeid = req.params.maeid;
        const myPath = path.join(__dirname, '../jobs/_tmp', maeid);

        // create working directory
        await new Promise(r => fs.mkdir(myPath, { recursive: true }, () => r(0)));

        // move uploaded file to working path
        await new Promise(r => fs.rename(
            path.join(fileInfo.destination, fileInfo.filename),
            path.join(myPath, 'MultiAssayExperiment.rds'),
            () => r(0)
        ));

        // run ExtractMultiAssayExperiment.R
        const process = spawn(
            global.RPath,
            [
                path.join(__dirname, '../scripts/R/ExtractMultiAssayExperiment.R'),
                myPath
            ]
        );

        process.stdout.on('data', data => fs.appendFileSync(
            path.join(myPath, '.log'),
            `stdout: ${data}`
        ));

        process.stderr.on('data', data => fs.appendFileSync(
            path.join(myPath, '.log'),
            `stderr: ${data}`
        ));

        process.on('close', code => {
            fs.writeFileSync(
                path.join(myPath, '.status'),
                JSON.stringify({ status: code == 0 ? 'ok' : 'error', code: code })
            )
            setTimeout(() => fs.rmSync(myPath, {recursive:true, force:true}), 30000);
        })

        // send data to front-end
        res.json({ status: 'ok' });

    });

router.get('/get_multi_assay_experiment/:maeid', async (req, res) => {

    // constants
    const maeid = req.params.maeid;
    const myPath = path.join(__dirname, '../jobs/_tmp', maeid);

    // check status
    let status = {status: 'waiting'};
    await new Promise(r => fs.readFile(
        path.join(myPath, '.status'), 'utf-8',
        (err, data) => {
            if (!err) {
                status = JSON.parse(data);
            }
            r(0);
        })
    );

    if (status.status != 'ok') {
        res.json({ status });
        return
    }

    // get filename of generated tables
    let filenames = [];
    await new Promise(r => fs.readdir(myPath, (err, files) => {
        filenames = files.filter(e => /\.tsv$/.test(e));
        r(0);
    }));

    // read files
    let fileStr = {};
    await new Promise(r => Promise.all(
        filenames.map(e => new Promise(r => {
            fs.readFile(
                path.join(myPath, e), 'utf-8',
                (err, data) => {
                    const mykey = OMICNAMES.reduce(
                        (prev, curr) => prev.replace(curr[0], curr[1]),
                        e.replace(/.tsv/, '')
                    );
                    fileStr[mykey] = 'ID\t' + data;
                    r(0);
                }
            );
        }))
    ).then(() => r(0)));

    res.json({ status, fileStr });
})

// Export
module.exports = router;