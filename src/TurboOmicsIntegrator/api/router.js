// Import modules
const express = require('express');
const fs = require('fs');
const path=require('path');

// Variables
const router = express.Router();

// Routes

/*
Description: Buscar trabajos anteriores a partir del ID
Params: 
    - JobID
Return:
    - JSON con todos los resultados del trabajo
    - JSON vacío si el trabajo no tiene resultados
*/
router.get('/search/:jobID', (req, res) => {
    console.log(`Searching job: ${req.params.jobID}`);

    const jobPath = path.join(__dirname, '../jobs', req.params.jobID, 'results.json');

    try {
        // Attempt to access the file
        fs.accessSync(jobPath, fs.constants.F_OK);
        console.log(`Job found: ${req.params.jobID}`);
    
        // Read JSON file with results and send to client
        const results = JSON.parse(fs.readFileSync(jobPath, 'utf-8'));
        console.log(`Results read: ${req.params.jobID}`);

        res.json({exist: true, results: results});
    
    } catch (error) {
        console.log(`Error in search: ${req.params.jobID}`);
        console.log(error);
        res.json({exist: false}); // File does not exist or cannot be accessed
    }
})

module.exports = router;