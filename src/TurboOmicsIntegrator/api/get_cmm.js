/*
This route is developed to be used only under docker container
*/

// Import libraries
const { Router } = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Constants
const router = Router();
const CMM_URI = "https://ceumass.eps.uspceu.es/mediator/api/v3/batch";

// Route
router.post('/get_cmm', async (req, res) => {

    const resCMM = await new Promise(res => {
        fetch(
            CMM_URI,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            }
        ).then(value => res(value));
    });
    const resCMMJson = await resCMM.json();
    res.json(resCMMJson);

});

// Export
module.exports = router;