const express = require('express');
const fs = require('fs');
const path = require('path');

const createDirectoryTree = require('../scripts/js/createDirectoryTree');
const { spawnSync } = require('child_process');

// Variables
const router = express.Router();

// Local Functions

/*
Escribir xi.json, escalar e imputar missing values
*/
function dataScalerImputer(jobContext, fileType, myPathX) {
    fs.writeFileSync(
        path.join(myPathX, `${fileType}.json`),
        JSON.stringify(jobContext.user[fileType]),
        'utf-8'
    )

    const result = spawnSync(
        global.pythonPath,
        [
            path.join(__dirname, '../scripts/py/data_scaler_and_imputer.py'),
            path.join(myPathX, `${fileType}.json`),
            jobContext.results.PRE.MVType[fileType]
        ],
        { encoding: 'utf-8' }
    )

    // Verifica si hubo errores
    if (result.error) {
        console.error('Error when executing data_scaler_and_imputer.py', result.error);
        return null;
    } else {
        // Muestra la salida estándar del programa Python
        console.log('Output of data_scaler_and_imputer.py:', result.stdout);
        return JSON.parse(
            fs.readFileSync(
                path.join(myPathX, `${fileType}_norm.json`), 'utf-8'
            )
        );
    }


}

/*
Descripción: 
    Ruta para para inicializar trabajo (Create Job). 
    Se crea el árbol de directorios.
    Se realiza el centrado, escalado e imputación de MV en las tablas xq y xm.
    Se guarda el objeto JobContext actualizado y se retorna a cliente

Params:
    - JobContext: Objeto JSON con toda la información recopilada en new-job
Return
    - JobContextNorm: Objeto JSON donde se añaden las tablas xq y xm procesadas
*/
router.post('/create_job', (req, res) => {
    console.log(`Creating job: ${req.body.jobID}`);

    // Get job context
    const jobContext = req.body;
    myPath = path.join(__dirname, '../jobs', jobContext.jobID)
    myPathX = path.join(myPath, 'EDA/xPreProcessing')

    // Create directory tree
    createDirectoryTree(myPath);

    // Center, Scale and Impute missing values
    console.log('Scale and center in xq');
    jobContext.norm.xq = dataScalerImputer(jobContext, 'xq', myPathX)

    console.log('Scale and center in xm');
    jobContext.norm.xm = dataScalerImputer(jobContext, 'xm', myPathX)

    // Send jobContext
    res.json(jobContext);
})

module.exports = router;