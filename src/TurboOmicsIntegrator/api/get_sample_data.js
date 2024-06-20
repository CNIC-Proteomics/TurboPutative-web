// Import modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// Variables
const router = express.Router();

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
        'xm': JSON.parse(fs.readFileSync(path.join(myPath, 'Xm_50.json'), 'utf-8')),
        'mdata': JSON.parse(fs.readFileSync(path.join(myPath, 'main_metadata.json'), 'utf-8')),
        'q2i': JSON.parse(fs.readFileSync(path.join(myPath, 'q2info.json'), 'utf-8')),
        'm2i': JSON.parse(fs.readFileSync(path.join(myPath, 'f2i.json'), 'utf-8'))
    }

    res.json(resJson);
});

router.get('/download_sample_data', (req, res) => {
    console.log('Downloading Sample Data');
    const myPath = path.join(__dirname, '../misc/');
    res.download(path.join(myPath, 'TurboOmics-SampleData.zip'));
})


module.exports = router;