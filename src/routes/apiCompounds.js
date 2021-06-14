// Import modules
const { Router } = require ('express');
const fs = require ('fs');
const path = require ('path');
const Joi = require('joi');

const { getParsedNames, classifyCompounds } = require(path.join(__dirname, 'lib/apiCompoundsUtilities.js'));

// Instantiate Router
const router = Router ();

// Define routes

// route that receive name of the compounds as payloads (/api/parse?name=compound1&name=compound2...)
router.get ('/api/parse', async (req, res) => {

    // check if compound key is in req.query, and in correct format
    let schema = Joi.object({
        'compound': Joi.alternatives().try(Joi.string(), Joi.array().min(1).max(1000)).required()
    });

    let validation = schema.validate(req.query);
    if (validation.error)
    {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    // If compound is a string (when sending only one), convert to array
    if (typeof req.query.compound === 'string') req.query.compound = [req.query.compound];

    // Apply map to req.query.compound to get parsed compound
    let parsedArr = await getParsedNames(req.query.compound);
    res.json({"parsedCompounds": parsedArr});

    return;
})

// route that receives name of compounds in a list (set a maximum)
router.post ('/api/parse', async (req, res) => {

    // check format
    let schema = Joi.object ({
        "compound": Joi.array().items(Joi.string()).min(1).max(1000).required()
    })
    
    let validation = schema.validate(req.body);
    
    if (validation.error)
    {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    // search compound in processed list
    let parsedArr = await getParsedNames (req.body.compound);
    res.json({"parsedCompound": parsedArr});

    return;
})

// route that receives the name of compounds and classify as done by Tagger
router.get('/api/classify', async (req, res) => {

        // check if compound key is in req.query, and in correct format
        let schema = Joi.object({
            'compound': Joi.alternatives().try(Joi.string(), Joi.array()).required()
        });
    
        let validation = schema.validate(req.query);
        if (validation.error)
        {
            res.status(400).send(validation.error.details[0].message);
            return;
        }
    
        // If compound is a string (when sending only one), convert to array
        if (typeof req.query.compound === 'string') req.query.compound = [req.query.compound];

        // classify each compound sent by the user
        let classResult = await classifyCompounds(req.query.compound);

        res.json(classResult);
})

// route that receives the name of compounds and classify as done by Tagger
router.post('/api/classify', async (req, res) => {

    // check format
    let schema = Joi.object ({
        "compound": Joi.array().items(Joi.string()).min(1).max(100).required()
    })

    let validation = schema.validate(req.body);
    if (validation.error)
    {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    // classify each compound sent by the user
    let classResult = await classifyCompounds(req.body.compound);

    res.json(classResult);
})

// Export router
module.exports = router;