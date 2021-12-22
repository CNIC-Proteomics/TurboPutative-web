// Import modules
const express = require('express');
const fs = require("fs");
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const { urlencoded } = require('express');


// global objects to control processes
global.processManager = require(path.join(__dirname, './lib/processManager.js'));
global.updateTPMapTable = require(path.join(__dirname, './lib/updateTPMapTable.js'));
global.updateTPMapTable.main();

global.pythonPath = "python" // exec cwd is process.cwd --> src/..

// Global variables
var app = express();


// Settings
let listenOnPort = true;

app.set('port', process.env.PORT || 8080);
let socketPath = "/tmp/TurboPutative"

global.processManager.MAX_PROCESS = 2;  
app.set('trust proxy', true);

// Middlewares
/*
app.use(function(req, res, next) {
    res.redirect("http://proteomics.cnic.es/TurboPutative");
})
*/

app.use(cors());
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(require(path.join(__dirname, "routes/index.js")));
app.use(require(path.join(__dirname, "routes/execute.js")));
app.use(require(path.join(__dirname, "routes/apiExecute.js")));
app.use(require(path.join(__dirname, "routes/apiCompounds.js")));
app.use(require(path.join(__dirname, "routes/viewResults.js")));
app.use(require(path.join(__dirname, "routes/admin.js")));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start listening
if (listenOnPort)
{
    app.listen(app.get('port'), () => {
        console.log('TurboPutative web application listening on port', app.get('port'));
    });
} else
{  
    if (fs.existsSync(socketPath)) fs.unlinkSync(socketPath);
    app.listen(socketPath, () => {
        console.log(`TurboPutative web application listening on ${socketPath}`);
    });
}
