const express = require('express');
const fs = require('fs');
const path = require('path');

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
router.get('/get_eda_pca/:jobID/:omic', async (req, res) => {
    console.log(`Getting EDA-PCA data: ${req.params.jobID}`);

    // get params
    const { jobID, omic } = req.params;

    // set working path
    const myPathPCAOmic = path.join(__dirname, `../jobs/${jobID}/EDA/PCA/${omic}`);

    // check that all required files exist
    let dataPCA = {
        projections: null,
        loadings: null,
        explained_variance: null,
        anova: null
    }

    const status = await readJsonFile(myPathPCAOmic, `.status`);

    if (status.status == 'ok') {

        console.log('EDA-PCA files exist. Read and send');

        fileTypes = Object.keys(dataPCA);

        await new Promise(resolve => {
            Promise.all(
                fileTypes.map(e => readJsonFile(myPathPCAOmic, `${e}.json`))
            ).then((values) => {
                fileTypes.map((e, i) => {
                    dataPCA[e] = values[i];
                });
                resolve(0);
            })
        });

    } else {
        console.log(`EDA-PCA files do not exist (yet?): ${JSON.stringify(status)}`);
    }

    res.json({ resStatus: status, dataPCA: dataPCA });
})

// Export
module.exports = router;