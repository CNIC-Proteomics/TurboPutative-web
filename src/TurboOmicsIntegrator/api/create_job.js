const express = require('express');
const fs = require('fs');
const path = require('path');

const createDirectoryTree = require('../scripts/js/createDirectoryTree');

const dataScalerImputer = require('./exec/dataScalerImputer');
const PCA_ANOVA_PY = require('./exec/pcaAnovaAnalysis');

// Variables
const router = express.Router();


/*
Escribir tablas de forma síncrona
*/
function writeJSON(jsonObject, filePath) {
    fs.writeFile(
        filePath,
        JSON.stringify(jsonObject),
        'utf-8',
        err => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${filePath} written successfully`);
            }
        }
    );
}

const myLogging = msg => {

}

/*
Descripción: 
    Ruta para para inicializar trabajo (Create Job). 
    Se crea el árbol de directorios.
    Se realiza el centrado, escalado e imputación de MV en las tablas xq y xm.
    Se guarda el objeto JobContext actualizado y se retorna a cliente
    Se ejecutan los módulos que no precisan configuración de usuario

Params:
    - JobContext: Objeto JSON con toda la información recopilada en new-job
Return
    - JobContextNorm: Objeto JSON donde se añaden las tablas xq y xm procesadas
*/
router.post('/create_job', (req, res) => {
    console.log(`Creating job: ${req.body.jobID}`);

    // Get job context
    const jobContext = req.body;
    myPath = path.join(__dirname, '../jobs', jobContext.jobID);
    myPathX = path.join(myPath, 'EDA/xPreProcessing');
    myPathPCA = path.join(myPath, 'EDA/PCA');

    // Create directory tree
    createDirectoryTree(myPath);

    // Center, Scale and Impute missing values
    console.log('Scale and center in xq');
    jobContext.norm.xq = dataScalerImputer(jobContext, 'xq', myPathX);

    console.log('Scale and center in xm');
    jobContext.norm.xm = dataScalerImputer(jobContext, 'xm', myPathX);

    // Write mdata, q2i and m2i synchronously
    writeJSON(jobContext.user.mdata, path.join(myPathX, 'mdata.json'));
    writeJSON(jobContext.user.q2i, path.join(myPathX, 'q2i.json'));
    writeJSON(jobContext.user.m2i, path.join(myPathX, 'm2i.json'));
    writeJSON(jobContext.index, path.join(myPathX, 'index.json'));
    writeJSON(jobContext.mdataType, path.join(myPathX, 'mdataType.json'));

    // jobContext used in find job
    const preJobContext = {
        ...jobContext,
        user: {
            xq: null,
            xm: null,
            mdata: null,
            q2i: null,
            m2i: null
        },
        index: {
            xq: null,
            xm: null,
            mdata: null,
            q2i: null,
            m2i: null
        },
        norm: {
            xq: null,
            xm: null
        },
        mdataType: {}
    };

    writeJSON(preJobContext, path.join(myPath, 'preJobContext.json'));

    /*
    Run modules that can be run without user configuration
    */

    // PCA_ANOVA_ANALYSIS
    PCA_ANOVA_PY(myPathX, myPathPCA, 'q');
    PCA_ANOVA_PY(myPathX, myPathPCA, 'm');

    // Send jobContext
    res.json(jobContext);
})

module.exports = router;