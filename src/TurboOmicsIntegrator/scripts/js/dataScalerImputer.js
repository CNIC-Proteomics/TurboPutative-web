/*
Import modules
*/
const path = require('path');
const fs = require('fs');
const { spawnSync, spawn } = require('child_process');

/*
Escribir xi.json, escalar e imputar missing values
*/
function dataScalerImputer(jobContext, fileType, myPathX) {
    return new Promise(resolve => {

        fs.writeFileSync(
            path.join(myPathX, `${fileType}.json`),
            JSON.stringify(jobContext.user[fileType]),
            'utf-8'
        );

        const process = spawn(
            global.pythonPath,
            [
                path.join(__dirname, '../../scripts/py/data_scaler_and_imputer.py'),
                path.join(myPathX, `${fileType}.json`),
                jobContext.results.PRE.MVType[fileType],
                jobContext.results.PRE.MVThr[fileType]
            ],
            { encoding: 'utf-8' }
        )

        process.stdout.on('data', data => fs.appendFileSync(
            path.join(myPathX, `${fileType}.log`),
            `stdout: ${data}`)
        );

        process.stderr.on('data', data => fs.appendFileSync(
            path.join(myPathX, `${fileType}.log`)
                `stderr: ${data}`)
        );

        process.on('close', code => {
            if (code == 0) {
                resolve(JSON.parse(
                    fs.readFileSync(
                        path.join(myPathX, `${fileType}_norm.json`), 'utf-8'
                    )
                ));
            } else {
                resolve(null);
            }
        })

        /*const result = spawnSync(
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
            resolve(null);
        } else {
            // Muestra la salida estándar del programa Python
            fs.writeFileSync(
                path.join(myPathX, `${fileType}.log`),
                result.stdout
            )
            resolve(JSON.parse(
                fs.readFileSync(
                    path.join(myPathX, `${fileType}_norm.json`), 'utf-8'
                )
            ));
        }*/
    })
}

module.exports = dataScalerImputer;