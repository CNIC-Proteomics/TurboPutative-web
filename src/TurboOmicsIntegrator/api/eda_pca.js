const express = require('express');
const fs = require('fs');
const path = require('path');

const { spawnSync } = require('child_process');

// Variables
const router = express.Router();

// Local Functions

function checkFileExistence(myPath, files) {
    for (const file of files) {
        console.log(file)
        if (!fs.existsSync(path.join(myPath, file))) {
            return false;
        }
    }
    return true;
}

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

function PCA_ANOVA_PY(myPathX, myPath, omic) {

    const script = 'pca_anova_analysis.py'

    const result = spawnSync(
        global.pythonPath,
        [
            path.join(__dirname, `../scripts/py/${script}`),
            omic,
            path.join(myPathX, `x${omic}_norm.json`),
            path.join(myPathX, `mdata.json`),
            path.join(myPathX, `mdataType.json`),
            path.join(myPathX, `index.json`),
            myPath
        ],
        { encoding: 'utf-8' }
    );

    // Verifica si hubo errores
    if (result.error) {
        console.error(`Error when executing ${script}`, result.error);
        return false;
    } else {
        // Muestra la salida estándar del programa Python
        console.log(`Output of ${script}:`, result.stdout);
        return true
    }
}

// Route
router.get('/get_eda_pca/:jobID/:omic', (req, res) => {
    console.log(`Getting EDA-PCA data: ${req.params.jobID}`);

    // get params
    const { jobID, omic } = req.params;

    // set working path
    const myPath = path.join(__dirname, `../jobs/${jobID}/EDA/PCA/${omic}`);
    const myPathX = path.join(__dirname, `../jobs/${jobID}/EDA/xPreProcessing`);

    // check that all required files exist
    const dataPCA = {
        projections: {},
        loadings: {},
        explained_variance: {},
        anova: {}
    }

    if (
        checkFileExistence(
            myPath,
            Object.keys(dataPCA).map(e => `${e}.json`)
        )
    ) {
        console.log('EDA-PCA files already exist');
        Object.keys(dataPCA).map(e => {
            dataPCA[e] = readJsonFileSync(myPath, `${e}.json`);
        });
    } else {
        console.log('EDA-PCA files do not exist. Executing pca_anova_analysis.py...');
        const status = PCA_ANOVA_PY(myPathX, myPath, omic);
        if (status) {
            console.log('EDA-PCA created');
            Object.keys(dataPCA).map(e => {
                dataPCA[e] = readJsonFileSync(myPath, `${e}.json`);
            });
        }
    }

    // send to client
    res.json(dataPCA);
})

// Export
module.exports = router;