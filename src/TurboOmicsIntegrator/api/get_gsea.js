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
    const myPath = path.join(__dirname, '../jobs', jobID, 'GSEA', omic, gseaID);

    // Read file
    const gseaData = await new Promise(resolve => fs.readFile(
        path.join(myPath, `${db}_GSEA.json`), 'utf-8',
        (err, data) => {
            if (err) {
                resolve(false);
            } else {
                resolve(JSON.parse(data));
            }
        }
    ));

    // if file does not exist...
    if (!gseaData) {

        // if error.log file exists, there was an error
        const err = await new Promise(resolve => fs.readFile(
            path.join(myPath, 'error.log'), 'utf-8',
            (err, data) => err ? resolve(false) : resolve(true)
        ));

        if (err) {
            console.log(`${jobID}: Error obtaining GSEA data ${omic} --> ${gseaID} - ${db}`);
            res.json({ status: 'error', gseaRes: null});
        } else {
            res.json({status: 'waiting'});
        }

        return;
    }

    console.log(`${jobID}: Sending GSEA data ${omic} --> ${gseaID} - ${db}`);
    res.json({ status: 'ok', gseaRes: gseaData });

});

// Export
module.exports = router