/*
Import modules
*/
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

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
            path.join(__dirname, '../../scripts/py/data_scaler_and_imputer.py'),
            path.join(myPathX, `${fileType}.json`),
            jobContext.results.PRE.MVType[fileType],
            jobContext.results.PRE.MVThr[fileType]
        ],
        { encoding: 'utf-8' }
    );

    // Verifica si hubo errores
    if (result.error) {
        fs.writeFileSync(
            path.join(myPathX, `${fileType}.log`),
            result.error
        )
        return null;
    } else {
        // Muestra la salida estándar del programa Python
        fs.writeFileSync(
            path.join(myPathX, `${fileType}.log`),
            result.stdout
        )
        return JSON.parse(
            fs.readFileSync(
                path.join(myPathX, `${fileType}_norm.json`), 'utf-8'
            )
        );
    }
}

module.exports = dataScalerImputer;