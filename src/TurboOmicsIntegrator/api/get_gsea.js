// Import libraries
const express = require('express');
const fs = require('fs');
const path = require('path');


// Set constants
const router = express.Router();

// Routes
router.get('/get_gsea/:jobID/:omic/:gseaID/:db', async (req, res) => {

    // get params
    const { jobID, omic, gseaID, db } = req.params;

    console.log(`${jobID}: Fetching GSEA data ${omic} --> ${gseaID} - ${db}`);

    // set paths
    let myPath = path.join(__dirname, '../jobs', jobID, 'GSEA', omic, gseaID);

    // if omic == m, determine whether it is msea o mummichog
    let mMethod = null;
    if (omic == 'm') {
        if (['pos', 'neg'].includes(db)) {
            mMethod = 'mummichog';
            myPath = path.join(myPath, mMethod, db);
        }
        if (['KEGG', 'ChEBI'].includes(db)) {
            mMethod = 'msea';
            myPath = path.join(myPath, mMethod, db);
        }
    }

    // if error.log file exists, there was an error
    const err = await new Promise(resolve => fs.readFile(
        path.join(myPath, 'error.log'), 'utf-8',
        (err, data) => err ? resolve(false) : resolve(true)
    ));

    if (err) {
        console.log(`${jobID}: Error obtaining GSEA data ${omic} --> ${gseaID} - ${db}`);
        res.json({ status: 'error', gseaRes: null });
        return
    }

    // Read file
    // in mummichog, each result is in a different folder
    let myPathResults = mMethod == 'mummichog' ? fs.readdirSync(myPath).filter(e => e.includes('results'))[0] : '';
    myPathResults = myPathResults == undefined ? '' : myPathResults;
    myPathResults = path.join(myPath, myPathResults);

    const myPathFileRes = mMethod == 'mummichog' ?
        path.join(myPathResults, 'tables/mcg_pathwayanalysis_results.tsv') :
        path.join(myPathResults, `${db}_GSEA.json`);

    const gseaData = await new Promise(resolve => fs.readFile(
        myPathFileRes, 'utf-8',
        (err, data) => {
            if (err) {
                resolve(false);
            } else {
                resolve(mMethod == 'mummichog' ? data : JSON.parse(data));
            }
        }
    ));

    // In mummichog, read files that relate to user ID
    let usrInput2EC = {}
    if (mMethod == 'mummichog') {

        usrInput2EC = await new Promise(resolve => {
            fs.readFile(
                path.join(myPathResults, 'tables/userInput_to_EmpiricalCompounds.tsv'), 'utf-8',
                (err, data) => resolve(data)
            );
        });

    }

    // if file does not exist...
    if (!gseaData) {
        res.json({ status: 'waiting' });
    } else {
        console.log(`${jobID}: Sending GSEA data ${omic} --> ${gseaID} - ${db}`);
        res.json({ status: 'ok', gseaRes: gseaData, usrInput2EC });
    }

    return;
});

// Export
module.exports = router