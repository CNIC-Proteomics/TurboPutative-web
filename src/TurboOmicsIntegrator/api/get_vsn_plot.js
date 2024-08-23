// Import libraries

const { Router } = require('express');
const path = require('path');
const fs = require('fs');

// Constants
const router = Router();

// Routes
router.get('/get_vsn_plot/:jobID/:omic', (req, res) => {
    const { jobID, omic } = req.params;
    const myPath = path.join(__dirname, `../jobs/${jobID}/EDA/xPreProcessing/vsn/x${omic}_vsn.png`);
    res.sendFile(myPath);
})

// Export
module.exports = router;