// Import modules
const express = require("express");

// Constants
const router = express.Router();

// Routes
router.post('/run_gsea', (req, res) => {

    res.json({status:'running'});

});

// Export
module.exports = router;