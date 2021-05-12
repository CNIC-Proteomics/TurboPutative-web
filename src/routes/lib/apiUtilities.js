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

            /*
            // if parameters is sent, but it is empty, return an error
            if ('parameters' in files && files.parameters.size == 0) {
                res.status(400).send('parameters.json file is required');
                resolve(undefined);
                return;
            }*/

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
                    defaultParametersPath = path.join(__dirname, '../../public/assets/files', defaultParameters);
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
module.exports.checkModuleParameters = checkModuleParameters;
module.exports.INIStringGenerator = INIStringGenerator;