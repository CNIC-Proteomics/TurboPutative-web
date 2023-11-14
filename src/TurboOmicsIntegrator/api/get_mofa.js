const express = require('express');
const fs = require('fs');
const path = require('path');

const myLogger = require('../scripts/js/myLogger');

// Variables
const router = express.Router();

// Local Functions

function readJsonFile(myPath, fileName) {
    return new Promise((resolve, reject) => {
        // Read the JSON file synchronously
        fs.readFile(path.join(myPath, fileName), 'utf8', (err, data) => {
            if (err) reject(1);
            resolve(JSON.parse(data));
        });
    })
}


// Route
router.get('/get_mofa/:jobID', async (req, res) => {
    
    // get params
    const { jobID } = req.params;
    
    // set working path
    const myPath = path.join(__dirname, `../jobs/${jobID}`)
    const myPathMOFA = path.join(__dirname, `../jobs/${jobID}/MOFA/`);
    
    myLogging = myLogger(myPath)

    myLogging(`Getting MOFA data`);
    
    // check that all required files exist
    let dataMOFA = {
        projections: null,
        loadings: null,
        explained_variance: null,
        anova: null
    }

    const status = await readJsonFile(myPathMOFA, `.status`);

    if (status.status == 'ok') {

        myLogging('MOFA files exist. Read and send');

        fileTypes = Object.keys(dataMOFA);

        await new Promise(resolve => {
            Promise.all(
                fileTypes.map(e => readJsonFile(myPathMOFA, `${e}.json`))
            ).then((values) => {
                fileTypes.map((e, i) => {
                    dataMOFA[e] = values[i];
                });
                resolve(0);
            })
        });

    } else {
        myLogging(`MOFA files do not exist (yet?): ${JSON.stringify(status)}`);
    }

    res.json({ resStatus: status, dataMOFA: dataMOFA });
})

// Export
module.exports = router;