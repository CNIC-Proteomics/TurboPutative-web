// Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');


// Variables
const router = express.Router();

// Add routes from other files
router.use('/', require('./create_job'));
router.use('/', require('./get_eda_pca'));
router.use('/', require('./get_mofa'));
router.use('/', require('./get_status'));

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

        res.json({ exist: true, results: results });

    } catch (error) {
        console.log(`Error in search: ${req.params.jobID}`);
        console.log(error);
        res.json({ exist: false }); // File does not exist or cannot be accessed
    }
})


/*
Descripción: Ruta para adquirir tablas de ejemplos desde cliente
Params:
    - No recibe ningún parámetro
Return:
    - Devuelve un objeto JSON con las 5 tablas necesarias para iniciar la creación del proyecto

    TODO: Lo cambiaremos más adelante para cargar un trabajo
*/
router.get('/load_sample_data', (req, res) => {
    console.log('Sending Sample Data');

    const myPath = path.join(__dirname, '../misc/');

    resJson = {
        'xq': JSON.parse(fs.readFileSync(path.join(myPath, 'Xq_minus_X_norm_woMV.json'), 'utf-8')),
        'xm': JSON.parse(fs.readFileSync(path.join(myPath, 'Xm.json'), 'utf-8')),
        'mdata': JSON.parse(fs.readFileSync(path.join(myPath, 'main_metadata.json'), 'utf-8')),
        'q2i': JSON.parse(fs.readFileSync(path.join(myPath, 'q2info.json'), 'utf-8')),
        'm2i': JSON.parse(fs.readFileSync(path.join(myPath, 'f2i_TP.json'), 'utf-8'))
    }

    res.json(resJson);
})


module.exports = router;