// Load libraries
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Set constants
const router = express.Router();
const CMM_URI = "http://ceumass.eps.uspceu.es/mediator/api/v3/batch";

// Create routes
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