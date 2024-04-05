// Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

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
    res.json({exist: false});
});

module.exports = router;