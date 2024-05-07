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
    myPath = omic == 'm' ? path.join(myPath, db) : myPath;


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
    let myPathResults = omic == 'm' ? fs.readdirSync(myPath).filter(e => e.includes('results'))[0] : '';
    myPathResults = myPathResults == undefined ? '' : myPathResults;
    myPathResults = path.join(myPath, myPathResults);

    const myPathFileRes = omic == 'm' ?
        path.join(myPathResults, 'tables/mcg_pathwayanalysis_results.tsv') :
        path.join(myPathResults, `${db}_GSEA.json`);

    const gseaData = await new Promise(resolve => fs.readFile(
        myPathFileRes, 'utf-8',
        (err, data) => {
            if (err) {
                resolve(false);
            } else {
                resolve(omic == 'm' ? data : JSON.parse(data));
            }
        }
    ));

    // if file does not exist...
    if (!gseaData) {
        res.json({ status: 'waiting' });
    } else {
        console.log(`${jobID}: Sending GSEA data ${omic} --> ${gseaID} - ${db}`);
        res.json({ status: 'ok', gseaRes: gseaData });
    }

    return;
});

// Export
module.exports = router