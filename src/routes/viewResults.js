//
// Import modules
// 

const { Router, json } = require("express");
const fs = require("fs");
const path = require("path");

const importPartials = require(path.join(__dirname, '../lib/importPartials.js'));
const importValues = require(path.join(__dirname, '../lib/importValues.js'));
const getSortedFiles = require(path.join(__dirname, '../lib/getSortedFiles.js'));


//
// Set constants
//

const router = Router();
var views = path.join(__dirname, '../views');
var jobPath = path.join(__dirname, '../public/jobs');


//
// Define routes
//

router.get('/viewresults/:id',(req, res) => {

    let htmlPath = path.join(jobPath, req.params.id, 'html');
    let rowPath = path.join(jobPath, req.params.id, 'row');

    // check if job dir exist
    if (!fs.existsSync(htmlPath) || !fs.existsSync(rowPath))
    {
        // read html view and import partials
        let html = importPartials(fs.readFileSync(path.join(views, "error.html"), "utf-8"));

        // import values
        html = importValues(html, {
            "<!-- INSERT VALUE: errorDescription -->": `${req.params.id} job not found`
        })

        // send complete html
        res.send(html);
        return;
    }

    // get html files
    const htmlFiles = getSortedFiles(htmlPath).reverse();

    // build nav tabs
    let navTabs = `
    <li class="nav-item">
        <a class="nav-link table-selector" id="a-summary" target="TP-summary" style="cursor:pointer;">Summary</a>
    </li>
    `;

    htmlFiles.forEach(element => {
        let fileName = element.split('.').slice(0,-1).join('.');
        let basename = 'TP-' + element.split('.').slice(0,-1).join('.').replace(/[^a-zA-Z0-9\-_]/g, '');
        navTabs += `<li class="nav-item">`;
        navTabs += `<a class="nav-link table-selector" id="a-${basename}" target="${basename}" style="cursor:pointer;">${fileName}</a>`;
        navTabs += `</li>`;
    });

    // build table contents
    let tabContent = `
    <div id="div-TP-summary" class="table-container" style="display:none;">
    </div>
    `;

    htmlFiles.forEach(element => {
        let basename = 'TP-' + element.split('.').slice(0,-1).join('.').replace(/[^a-zA-Z0-9\-_]/g, '');
        let tableHTML = fs.readFileSync(path.join(htmlPath, element), 'utf8');
        tableHTML = tableHTML.replace(/<table[^>]*>/, `<table id="${basename}" class="display nowrap" style="width:100%">`);
        tableHTML = tableHTML.replace(/<tr[^>]*>/, '<tr>');
        tableHTML = tableHTML.replace(/<\/?tbody>/g, '');

        tabContent += `<div id="div-${basename}" class="table-container" style="display:none;">`;
        tabContent += `${tableHTML}`;
        tabContent += `</div>`;
    });

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "viewResults.html"), "utf-8"));

    // introduce navtab and tables
    html = importValues(html, {
        '<!-- INSERT VALUE: NavTab -->' : navTabs,
        '<!-- INSERT VALUE: TabContent -->' : tabContent,
        '/* INSERT VALUE: jobID */' : req.params.id,
        "/* INSERT VALUE: linkToZip */": `${path.join(global.baseURL, '/jobs/', req.params.id, 'TurboPutative_results.zip')}`,
    })

    res.send(html);
});

router.get('/viewresults/get/:id', (req, res) => {

    let rowPath = path.join(jobPath, req.params.id, 'row');
    const rowFiles = getSortedFiles(rowPath).reverse();

    let type2basename = JSON.parse(fs.readFileSync(path.join(jobPath, req.params.id, 'json/type2basename.json')));
    let type2tablename = {}

    // Map type of file (MS_experiment, Tagger, REname...) to filename (without extension) and id of the corresponding table
    for (let key in type2basename) {
        let filename = type2basename[key].replace(/[^a-zA-Z0-9\-_]/g, '');
        type2basename[key] = filename;
        type2tablename[key] = `TP-${filename}`;
    }

    // Do not consider --> 'FeatureInfo'
    let types = ['MS_experiment', 'Tagger', 'REname', 'RowMerger', 'TableMerger'].filter(elem => {
        return Object.keys(type2basename).includes(elem);
    });

    let type2 = {
        'types': types,
        'type2basename': type2basename,
        'type2tablename': type2tablename
    };


    // Read rows
    let jsonRows = {};

    rowFiles.forEach(element => {
        let basename = 'TP-' + element.split('.').slice(0,-1).join('.').replace(/[^a-zA-Z0-9\-_]/g, '');
        jsonRows[basename] = [];

        let rows = fs.readFileSync(path.join(rowPath, element), 'utf-8').split('\n').slice(0,-1);
        rows.forEach(element => {
            jsonRows[basename].push(element.split('\t'));
        })
    })

    // resJSON
    let resJSON = {
        'metadata': type2,
        'jsonRows': jsonRows
    }

    res.send(resJSON);
});


//
// Export module
//

module.exports = router;