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
    );

    const result = spawnSync(
        global.pythonPath,
        [
            path.join(__dirname, '../scripts/py/data_scaler_and_imputer.py'),
            path.join(myPathX, `${fileType}.json`),
            jobContext.results.PRE.MVType[fileType],
            jobContext.results.PRE.MVThr[fileType]
        ],
        { encoding: 'utf-8' }
    );

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
    myPath = path.join(__dirname, '../jobs', jobContext.jobID);
    myPathX = path.join(myPath, 'EDA/xPreProcessing');

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

    // 
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

    // Send jobContext
    res.json(jobContext);
})

module.exports = router;