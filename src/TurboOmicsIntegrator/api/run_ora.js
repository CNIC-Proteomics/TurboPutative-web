// Import libraries
const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Set constants
const router = express.Router();

// Routing
router.post('/run_ora/:OS', (req, res) => {

    res.json({msg: 'ora listening'})

});

// Export
module.exports = router;