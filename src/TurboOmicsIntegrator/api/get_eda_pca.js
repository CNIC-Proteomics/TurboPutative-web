const express = require('express');
const fs = require('fs');
const path = require('path');

// Variables
const router = express.Router();

// Local Functions

function readJsonFileSync(myPath, fileName) {
    console.log(`Reading ${fileName}`);

    try {
        // Read the JSON file synchronously
        const jsonContent = fs.readFileSync(path.join(myPath, fileName), 'utf8');

        // Parse the JSON content into a JavaScript object
        const jsonData = JSON.parse(jsonContent);

        return jsonData;
    } catch (error) {
        // Handle any errors (e.g., file not found or invalid JSON)
        console.error(`Error reading JSON file "${fileName}": ${error.message}`);
        return null;
    }
}


// Route
router.get('/get_eda_pca/:jobID/:omic', (req, res) => {
    console.log(`Getting EDA-PCA data: ${req.params.jobID}`);

    // get params
    const { jobID, omic } = req.params;

    // set working path
    const myPathPCAOmic = path.join(__dirname, `../jobs/${jobID}/EDA/PCA/${omic}`);
    //const myPathX = path.join(__dirname, `../jobs/${jobID}/EDA/xPreProcessing`);

    // check that all required files exist
    let dataPCA = {
        projections: null,
        loadings: null,
        explained_variance: null,
        anova: null
    }

    const status = readJsonFileSync(myPathPCAOmic, `.status`);

    if (status.status == 'ok') {

        console.log('EDA-PCA files exist. Read and send');
        Object.keys(dataPCA).map(e => {
            dataPCA[e] = readJsonFileSync(myPathPCAOmic, `${e}.json`);
        });

    } else {
        console.log(`EDA-PCA files do not exist (yet?): ${JSON.stringify(status)}`);
        //dataPCA = null
    }

    res.json({ resStatus: status, dataPCA: dataPCA });
})

// Export
module.exports = router;