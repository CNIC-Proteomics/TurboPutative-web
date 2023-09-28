const express = require('express');
const fs = require('fs');
const path = require('path');

const { spawnSync } = require('child_process');

// Variables
const router = express.Router();

// Local Functions


/*
Descripción: 
    Petición para construir un modelo lineal aditivo y calcular el ANOVA tipo II
    a partir de los datos de una tabla. 
    Se guarda el objeto resultante del ANOVA

Params:
    - jsonRecords: Array con objetos JSON correspondientes a cada fila
Return
    - ANOVA_res.json: Objeto JSON con resultado del anova
*/

/*
router.post('/get_anova', (req, res) => {
    const {jobID, dataAnova} = req.body
    console.log(`Calculating ANOVA: ${jobID}`);

    // Set path
    const myPath = path.join(__dirname, '../jobs', jobID, 'tmp');

    // Write dataframe
    fs.writeFileSync(
        path.join(myPath, `dataAnova.json`),
        JSON.stringify(dataAnova),
        'utf-8'
    );

    // Calculate ANOVA


    // Send ANOVA results
    res.json({'pvalue': 0.05});
})

module.exports = router;
*/