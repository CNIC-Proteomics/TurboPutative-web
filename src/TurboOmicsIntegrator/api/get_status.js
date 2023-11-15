/*
Import modules
*/
const path = require('path');
const fs = require('fs');
const { Router } = require('express');

/*
Set constants
*/
const router = Router();

/*
Define routes
*/
router.get('/get_status/:jobID', (req, res) => {
    console.log(`Getting status for ${req.params.jobID}`);

    const { jobID } = req.params;
    const myPath = path.join(__dirname, `../jobs/${jobID}`);
    const resStatus = {};

    // Check EDA-PCA
    const EDA_PCA_q = JSON.parse(fs.readFileSync(
        path.join(myPath, 'EDA/PCA/q/.status'),
        'utf-8'
    ));

    const EDA_PCA_m = JSON.parse(fs.readFileSync(
        path.join(myPath, 'EDA/PCA/m/.status'),
        'utf-8'
    ));

    if (
        EDA_PCA_q.status == 'ok' &&
        EDA_PCA_m.status == 'ok'
    ) {
        resStatus.EDA_PCA = { status: 'ok' }

    } else if (
        EDA_PCA_q.status == 'waiting' ||
        EDA_PCA_m.status == 'waiting'
    ) {
        resStatus.EDA_PCA = { status: 'waiting' }

    } else {
        resStatus.EDA_PCA = { status: 'error' }
    }

    // Check MOFA
    resStatus.MOFA = JSON.parse(fs.readFileSync(
        path.join(myPath, 'MOFA/.status'),
        'utf-8'
    ));

    // Send status summary
    res.send(resStatus);
})

/*
Export module
*/
module.exports = router;