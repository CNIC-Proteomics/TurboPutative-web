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
function MOFA_ANOVA_PY(myPathX, myPathMOFA) {

    const script = 'mofa_anova_analysis.py'

    fs.writeFileSync(
        path.join(myPathMOFA, omic, '.status'),
        JSON.stringify({ status: 'waiting' })
    )

    const process = spawn(
        global.pythonPath,
        [
            path.join(__dirname, `../../scripts/py/${script}`),
            omic,
            path.join(myPathX, `x${omic}_norm.json`),
            path.join(myPathX, `mdata.json`),
            path.join(myPathX, `mdataType.json`),
            path.join(myPathX, `index.json`),
            path.join(myPathPCA, omic)
        ],
        { encoding: 'utf-8' }
    );

    process.stdout.on('data', data => fs.appendFileSync(
        path.join(myPathPCA, omic, '.log'),
        `stdout: ${data}`)
    );

    process.stderr.on('data', data => fs.appendFileSync(
        path.join(myPathPCA, omic, '.log'),
        `stderr: ${data}`)
    );

    process.on('close', code => {
        console.log(`${script} process exited with code ${code}`);
        if (
            code == 0 &&
            checkFileExistence(
                path.join(myPathPCA, omic),
                pcaFiles
            )
        ) {
            fs.writeFileSync(
                path.join(myPathPCA, omic, '.status'),
                JSON.stringify({ status: 'ok', code: code })
            )
        }
        else {
            fs.writeFileSync(
                path.join(myPathPCA, omic, '.status'),
                JSON.stringify({ status: 'error', code: code })
            )
        }
    })
}

module.exports = PCA_ANOVA_PY;