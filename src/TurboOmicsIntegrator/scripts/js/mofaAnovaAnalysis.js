/*
Import modules
*/
const path = require('path')
const { spawn } = require("child_process");
const fs = require("fs");

/*
Constants
*/

// Files that must be generated after the execution
const mofaFiles = [
    'anova.json',
    'explained_variance.json',
    'loadings.json',
    'projections.json'
]

/*
Local function
*/
function checkFileExistence(myPath, files) {
    for (const file of files) {
        console.log(file)
        if (!fs.existsSync(path.join(myPath, file))) {
            return false;
        }
    }
    return true;
}

/*
Main function
*/
function MOFA_ANOVA_PY(myPathX, myPathMOFA, myLogging) {

    return new Promise(resolve => {

        myLogging(`Executing MOFA_ANOVA_PY`);

        const script = 'mofa_anova_analysis.py'

        fs.writeFile(
            path.join(myPathMOFA, '.status'),
            JSON.stringify({ status: 'waiting' }),
            () => resolve(0)
        );

        const process = spawn(
            global.pythonPath,
            [
                path.join(__dirname, `../../scripts/py/${script}`),
                `--xq_path=${path.join(myPathX, 'xq_norm.json')}`,
                `--xm_path=${path.join(myPathX, 'xm_norm.json')}`,
                `--mdata_path=${path.join(myPathX, 'mdata.json')}`,
                `--mdata_type_path=${path.join(myPathX, 'mdataType.json')}`,
                `--index_path=${path.join(myPathX, 'index.json')}`,
                `--outfolder_path=${myPathMOFA}`
            ],
            { encoding: 'utf-8' }
        );

        process.stdout.on('data', data => fs.appendFileSync(
            path.join(myPathMOFA, '.log'),
            `stdout: ${data}`)
        );

        process.stderr.on('data', data => fs.appendFileSync(
            path.join(myPathMOFA, '.log'),
            `stderr: ${data}`)
        );

        process.on('close', code => {
            myLogging(`${script} process exited with code ${code}`);
            if (
                code == 0 &&
                checkFileExistence(
                    myPathMOFA,
                    mofaFiles
                )
            ) {
                fs.writeFileSync(
                    path.join(myPathMOFA, '.status'),
                    JSON.stringify({ status: 'ok', code: code })
                )
            }
            else {
                fs.writeFileSync(
                    path.join(myPathPCA, '.status'),
                    JSON.stringify({ status: 'error', code: code })
                )
            }
        })
    })
}

module.exports = MOFA_ANOVA_PY;