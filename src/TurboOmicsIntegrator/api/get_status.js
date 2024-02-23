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
router.get('/get_status/:jobID/:omics', (req, res) => {
    console.log(`Getting status for ${req.params.jobID}`);

    let { jobID, omics } = req.params;
    omics = omics.split('');

    const myPath = path.join(__dirname, `../jobs/${jobID}`);
    const resStatus = {};

    // Check EDA-PCA
    const EDA_PCA = omics.map(omic =>
        JSON.parse(fs.readFileSync(
            path.join(myPath, `EDA/PCA/${omic}/.status`),
            'utf-8'
        ))
    )

    if (
        EDA_PCA.every(e => e.status == 'ok')
    ) {
        resStatus.EDA_PCA = { status: 'ok' }

    } else if (
        EDA_PCA.some(e => e.status == 'waiting')
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