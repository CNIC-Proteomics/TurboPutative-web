//
// Import modules
//

const express = require("express");
const fs = require("fs");
const path = require("path");

const importPartials = require(path.join(__dirname, '../lib/importPartials.js'));
const importValues = require(path.join(__dirname, '../lib/importValues.js'));
const getSortedFiles = require(path.join(__dirname, '../lib/getSortedFiles.js'));


//
// Global variables
//

var router = express.Router();
var views = path.join(__dirname, '../views');


//
// Set routes
//

/*
router.get('/admin', (req, res) => {

    console.log(`** Send admin authenticate page`);

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, 'admin', 'login.html'), "utf-8"));

    // send complete html
    res.send(html);

})
*/

router.get('/tpmaptable', (req, res) => {

    //const user = req.body.user;
    //const psw = req.body.psw;

    const user = "";
    const psw = "";

    if (user === "" && psw === "")
    {
        // read html view and import partials
        let html = importPartials(fs.readFileSync(path.join(views, 'admin', 'mapUpdates.html'), "utf-8"));

        console.log(`** Send zip files`);

        // get files
        let files = getSortedFiles(path.join(__dirname, '../public/REnameMapTables'));
        // let files = fs.readdirSync(path.join(__dirname, '../public/REnameMapTables'));

        let htmlElem = "";
        for (let i=0; i<files.length; i++)
        {
            htmlElem += `<div class="card-text p-1">`;
            htmlElem += `<a class="link" href="/REnameMapTables/${files[i]}">${files[i]}</a>`;
            htmlElem += `</div>`;
        };

        html = importValues(html, {'<!-- INSERT VALUE: ZIP_FILES -->': htmlElem})

        // send complete html
        res.send(html);

    } else {
        res.send('Authentification failed');
    }

    

})


//
// Export module
//

module.exports = router;