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
    let navTabs = "";

    htmlFiles.forEach(element => {
        let basename = 'TP-' + element.split('.').slice(0,-1).join('.');
        navTabs += `<li class="nav-item">`;
        navTabs += `<a class="nav-link table-selector" data-toggle="tab" href="#div-${basename}" id="a-${basename}">${basename}</a>`;
        navTabs += `</li>`;
    });

    // build table contents
    let tabContent = "";

    htmlFiles.forEach(element => {
        let basename = 'TP-' + element.split('.').slice(0,-1).join('.');
        let tableHTML = fs.readFileSync(path.join(htmlPath, element), 'utf8');
        tableHTML = tableHTML.replace(/<table[^>]*>/, `<table id="${basename}" class="display nowrap" style="width:100%">`);
        tableHTML = tableHTML.replace(/<tr[^>]*>/, '<tr>');
        tableHTML = tableHTML.replace(/<\/?tbody>/g, '');

        tabContent += `<div id="div-${basename}" class="tab-pane">`;
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
    })

    res.send(html);
})

router.get('/viewresults/get/:id', (req, res) => {

    let rowPath = path.join(jobPath, req.params.id, 'row');
    const rowFiles = getSortedFiles(rowPath).reverse();

    let jsonRows = {};

    rowFiles.forEach(element => {
        let basename = 'TP-' + element.split('.').slice(0,-1).join('.');
        jsonRows[basename] = [];

        let rows = fs.readFileSync(path.join(rowPath, element), 'utf-8').split('\n').slice(0,-1);
        rows.forEach(element => {
            jsonRows[basename].push(element.split('\t'));
        })
    })

    res.send(jsonRows);
})

router.get('/viewresults/:id/:table', (req, res) => {

    let tableName = req.params.table.substr(3) + '.html';

    let tableHTML = fs.readFileSync(path.join(jobPath, req.params.id, 'html', tableName), 'utf-8');
    tableHTML = tableHTML.replace(/<table[^>]*>/, '<table class="display text-center">');
    tableHTML = tableHTML.replace(/<tr[^>]*>/, '<tr>');

    res.send(tableHTML);

})


//
// Export module
//

module.exports = router;