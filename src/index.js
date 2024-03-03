// Import modules
const express = require('express');
const fs = require("fs");
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const { urlencoded } = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

// global objects to control processes
global.processManager = require(path.join(__dirname, './lib/processManager.js'));
global.updateTPMapTable = require(path.join(__dirname, './lib/updateTPMapTable.js'));
global.updateTPMapTable.main();

global.pythonPath = "python" // exec cwd is process.cwd --> src/..
global.baseURL = '/TurboPutative';

// Global variables
var app = express();

// Settings
//let baseURL = '/TurboPutative'
app.set('port', process.env.PORT || 8080);
app.set('trust proxy', true);
global.processManager.MAX_PROCESS = 2;


// Middlewares
/*
app.use(function(req, res, next) {
    res.redirect("http://proteomics.cnic.es/TurboPutative");
})
*/

app.use(cors());

// Configura el proxy para redirigir las solicitudes a la API de destino
app.use(`${global.baseURL}/mediator/api/v3/batch`, createProxyMiddleware({
    target: 'http://ceumass.eps.uspceu.es',
    changeOrigin: true,
    pathRewrite: {[`${global.baseURL}/mediator/api/v3/batch`]: '/mediator/api/v3/batch'}
  }));

// app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(global.baseURL, require(path.join(__dirname, "routes/index.js")));
app.use(global.baseURL, require(path.join(__dirname, "routes/execute.js")));
app.use(global.baseURL, require(path.join(__dirname, "routes/apiExecute.js")));
app.use(global.baseURL, require(path.join(__dirname, "routes/apiCompounds.js")));
app.use(global.baseURL, require(path.join(__dirname, "routes/viewResults.js")));
app.use(global.baseURL, require(path.join(__dirname, "routes/admin.js")));

app.use(`${global.baseURL}/api/tbomics`, require(path.join(__dirname, 'TurboOmicsIntegrator/api/router.js')));

// Static files
app.use(global.baseURL, express.static(path.join(__dirname, 'public')));
app.use(global.baseURL, express.static(path.join(__dirname, 'TurboOmicsIntegrator/App')));


// Start listening
app.listen(app.get('port'), () => {
    console.log(`TurboPutative web application listening on :${app.get('port')}${global.baseURL}`);
});
