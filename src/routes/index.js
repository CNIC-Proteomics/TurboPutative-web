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
    let requestedUrl = req.protocol + '://' + req.get('Host') + req.url
    console.log(requestedUrl)
    res.redirect(global.baseURL+'/home')
});

router.get('/home', (req, res) => {

    console.log("** Sending main page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "main.html"), "utf-8"));

    // send complete html
    res.send(html);
})

router.get('/webserver', (req, res) => { // WebServer

    console.log("** Sending Web Server page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "webserver.html"), "utf-8"));

    // send complete html
    res.send(html);
})

router.get('/webservices', (req, res) => {

    console.log('** Sending Web Services page');

    // read view and import
    // let html = importPartials(fs.readFileSync(path.join(views, 'api/index.html'), 'utf-8'));
    let html = importPartials(fs.readFileSync(path.join(views, 'swagger.html'), 'utf-8'));

    // send page
    res.send(html);

})

router.get('/moduleshelp', (req, res) => {

    console.log("** Sending Modules Help page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "modulesHelp.html"), "utf-8"));
    
    // send complete html
    res.send(html);
})

router.get('/webserverhelp', (req, res) => {

    console.log("** Sending Web Server Help page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "webServerHelp.html"), "utf-8"));
    
    // send complete html
    res.send(html);
})

router.get('/webserviceshelp', (req, res) => {

    console.log("** Sending Web Services Help page");

    // read html view and import partials
    let html = importPartials(fs.readFileSync(path.join(views, "webServicesHelp.html"), "utf-8"));
    
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

// Export Route
module.exports = router;