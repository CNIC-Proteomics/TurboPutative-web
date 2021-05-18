// Import modules
const express = require("express");
const fs = require('fs');
const path = require('path');
const importPartials = require(path.join(__dirname, '../lib/importPartials.js'));

// Global variables
var router = express.Router();
var views = path.join(__dirname, '../views');

// Set routes
router.get('/', (req, res) => {

    console.log("** Sending main page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "main.html"), "utf-8"));

    // send complete html
    res.send(html);
})

router.get('/execute', (req, res) => {

    console.log("** Sending execute page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "execute.html"), "utf-8"));

    // send complete html
    res.send(html);
})

router.get('/contactUs', (req, res) => {

    console.log("** Sending contact us page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "contactUs.html"), "utf-8"));

    // send complete html
    res.send(html);
})

router.get('/modules', (req, res) => {

    console.log("** Sending modules page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "modules.html"), "utf-8"));
    
    // send complete html
    res.send(html);
})

router.get('/settings', (req, res) => {

    console.log("** Sending settings page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "settings.html"), "utf-8"));
    
    // send complete html
    res.send(html);
})

router.get('/api_documentation', (req, res) => {

    console.log('** Sending api documentation page');

    // read view and import
    let html = importPartials(fs.readFileSync(path.join(views, 'api/index.html'), 'utf-8'));

    // send page
    res.send(html);

})

router.get('/api_documentation/:service', (req, res) => {

    console.log(`** Sending ${req.params.service} documentation page`);

    // read view and import
    let html;
    try {
        html = importPartials(fs.readFileSync(path.join(views, `api/${req.params.service}.html`), 'utf-8'));
    } catch (err) {
        res.status(404).send('Page not found');
        return;
    }
    
    // send page
    res.send(html);
})

// Export Route
module.exports = router;