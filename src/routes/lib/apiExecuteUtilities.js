const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const Joi = require('joi');

function parseRequest (req, res, modality) {

    return new Promise(resolve => {
        
        // files and fields will be received by runWorkflow
        // parameters contains parameters.json. It will be parsed to obtain configUser
        let FilesAndFields = {
            "files": {
                "infile": {},
                "featInfoFile": {},
                "regexFile": { size: 0 } // For now we do not give possibility of using user regex.ini
            },
            "parameters": {}
        };

        console.log("** Parsing POST request with formidable");
        const form = formidable({ multiples: true });
        
        form.parse(req, (err, fields, files) => {

            if (err) {
                next(err);
                return;
            }

            // check if parameters.json and ms_table were sent

            // if parameters.json is not sent and it requested to run the full workflow, ERROR
            // if it is requested a specific module, it can be used default parameters
            if (!('parameters' in files) && modality == 'FULL') {
                res.status(400).send('"parameters" field is required');
                resolve(undefined);
                return;
            }

            if (!('ms_table' in files)) {
                res.status(400).send('"ms_table" field is required');
                resolve(undefined);
                return;
            }

            if (files.ms_table.size == 0) {
                res.status(400).send('File with compound names is required');
                resolve(undefined);
                return;
            }

            console.log("** Required files were sent");

            // read parameters.json
            console.log("** Reading parameters.json")
            let parametersJSON
            try {

                // if parameters.json was sent by the user, use it
                if ('parameters' in files)
                {
                    parametersJSON = JSON.parse(fs.readFileSync(files.parameters.path, 'utf-8'));
                }

                // if parameters.json was not found (using single module) use the default one
                if (!('parameters' in files))
                {
                    defaultParameters = `${modality}_defaultParameters.json`;
                    defaultParametersPath = path.join(__dirname, '../../public/assets/files/defaultParameters', defaultParameters);
                    parametersJSON = JSON.parse(fs.readFileSync(defaultParametersPath, 'utf-8'));
                }

            } catch (err) {
                console.error(err);
                res.status(400).send('A problem occurred when parsing parameters.json');
                resolve(undefined);
                return;
            }

            // assert that parameters.json is an object with "settings" field (later will check other fields)
            console.log("** Assert that parameters.json has settings field")
            const schema = Joi.object({
                "settings": Joi.object().min(1).required(),
                "modules": Joi.array()
            });

            validation = schema.validate(parametersJSON);
            if (validation.error) {
                res.status(400).send(validation.error.details[0].message);
                resolve(undefined);
                return;
            }

            // if modality is different from FULL, and user sent parameters.json without module,
            // add the module of the modality
            if (modality != 'FULL' && parametersJSON.modules===undefined)
            {
                parametersJSON.modules = [modality[0] + modality.slice(1).toLowerCase()]; // TAGGER --> Tagger
            } 

            // Build FilesAndFields object
            FilesAndFields.files.infile = files.ms_table;
            FilesAndFields.files.featInfoFile = files.tm_table;
            FilesAndFields.parameters = parametersJSON;

            // if these files were sent, resolve
            resolve(FilesAndFields);
            return;
        })
    })
}

// function used to perform general checks
// return a promise with true if checks are correct
function checkRequest (res, FilesAndFields) {

    return new Promise (async (resolve) => {

        // check modules given
        console.log('** Assert that modules given are correct');
        const modulesSchema = Joi.object({

            "modules": Joi.array().items(
                Joi.string().valid("Tagger"),
                Joi.string().valid("REname"),
                Joi.string().valid("RowMerger"),
                Joi.string().valid("TableMerger")
                ).min(1).unique().required(),

            "settings": Joi.object().required()
        });

        let validation = modulesSchema.validate(FilesAndFields.parameters);
        if (validation.error) {
            res.status(400).send(validation.error.details[0].message);
            resolve(false);
            return;
        }

        // check if parameters of each module are ok
        console.log('** Checking settings object sent for each module')
        selectedModules = FilesAndFields.parameters.modules;

        for (let i=0; i<selectedModules.length; i++) {
            let validationError = await checkModuleParameters(selectedModules[i], FilesAndFields.parameters.settings)
            
            if (validationError) {
                console.log(`** Error in ${selectedModules[i]} settings format`);
                res.status(400).send(validationError.details[0].message);
                resolve(false);
                return;
            }
        }

        // check if tm_table was sent in case TableMerger was selected
        let featInfoFile = FilesAndFields.files.featInfoFile;
        if (selectedModules.includes('TableMerger') && (featInfoFile == undefined || featInfoFile.size == 0)) {
            res.status(400).send("File with feature information used by TableMerger is required");
            resolve(false)
            return;
        }

        // if it reaches here, all checks were correct
        resolve(true);
        return;
    })

}


function checkModuleParameters (moduleToCheck, settingsObject) {
    // return Promise resolved to false if format is wrong. Otherwise, resolve to true
    return new Promise(resolve => {

        console.log(`** Checking ${moduleToCheck}`);
        let validation;

        // Validate TAGGER
        if (moduleToCheck == "Tagger"){

            let schema = Joi.object({
    
                "Tagger": Joi.object({
                    "food": Joi.string(),
                    "drug": Joi.string(),
                    "natural_product": Joi.string(),
                    "microbial_compound": Joi.string(),
                    "halogenated": Joi.string(),
                    "peptide": Joi.string(),
                    "plant": Joi.string(),
        
                    "halogenated_regex": Joi.string().allow(''),
                    "peptide_regex": Joi.string().allow(''),
        
                    "output_name": Joi.string().allow(''),
                    "output_columns": Joi.string().allow('')
                })
    
            }).unknown()
            
            validation = schema.validate(settingsObject);
        }

        // Validate RENAME
        if (moduleToCheck == "REname"){

            let schema = Joi.object({
    
                "REname": Joi.object({
                    "aminoacid_separator": Joi.string(),
                    "remove_row": Joi.string(),
                    "output_name": Joi.string().allow(''),
                    "output_columns": Joi.string().allow('')
                })
    
            }).unknown()
            
            validation = schema.validate(settingsObject);
        }

        // Validate ROWMERGER
        if (moduleToCheck == "RowMerger"){

            let schema = Joi.object({
    
                "RowMerger": Joi.object({
                    "compared_columns": Joi.string().allow(''),
                    "conserved_columns": Joi.string().allow(''),
                    "output_name": Joi.string().allow(''),
                    "output_columns": Joi.string().allow('')
                })
    
            }).unknown()
            
            validation = schema.validate(settingsObject);
        }

        // Validate TABLEMERGER
        if (moduleToCheck == "TableMerger"){

            let schema = Joi.object({
    
                "TableMerger": Joi.object({
                    "n_digits": Joi.string().pattern(/[1-9][0-9]*/),
                    "output_name": Joi.string().allow(''),
                    "output_columns": Joi.string().allow('')
                })
    
            }).unknown()
            
            validation = schema.validate(settingsObject);
        }
        
        resolve(validation.error);
        return;
    })
}

function INIStringGenerator (settingsObject) {

    return new Promise (resolve => {

        console.log("** Creating ini string (configUser.ini)")
        let iniString = "";

        for (mod in settingsObject) {

            iniString += `[${mod}]\n`;

            for (param in settingsObject[mod]) iniString += `${param}=${settingsObject[mod][param]}\n`;
        }

        resolve(iniString);
    })
}


// Export functions
module.exports.parseRequest = parseRequest;
module.exports.checkRequest = checkRequest;
// module.exports.checkModuleParameters = checkModuleParameters;
module.exports.INIStringGenerator = INIStringGenerator;