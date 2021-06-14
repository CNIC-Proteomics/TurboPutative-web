//
// Read file containing pre-processed compound names 
//
const fs = require('fs');
const path = require('path');

let tablePath = path.join(__dirname, '../../TurboPutative-2.0-built/TPProcesser/REname/data/preProcessedNames.tsv');
let compoundTable = fs.readFileSync(tablePath);

console.log ("** File containing preprocessed compound names was read");

// Export object
module.exports = compoundTable;