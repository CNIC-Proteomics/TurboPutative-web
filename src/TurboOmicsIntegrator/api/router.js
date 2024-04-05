// Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');


// Variables
const router = express.Router();

// Add routes from other files
router.use('/', require('./get_sample_data'));
router.use('/', require('./get_job'));
router.use('/', require('./create_job'));
router.use('/', require('./get_eda_pca'));
router.use('/', require('./get_mofa'));
router.use('/', require('./get_status'));
router.use('/', require('./run_turboputative'));
router.use('/', require('./get_turboputative'));
router.use('/', require('./run_gsea'));

// Export
module.exports = router;