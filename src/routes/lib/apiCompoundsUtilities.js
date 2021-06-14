const path = require ('path');
const fs = require ('fs');

const allRegex = require (path.join(__dirname, 'apiReadRegex.js'));
const compoundTable = require (path.join(__dirname, 'apiReadTableParsedCompounds.js'));

// Define functions

function getParsedNames (compoundArr) {
    /*
    Input: array with compound names 
    Output (resolve): another array with parsed names
    */

    return new Promise (resolve => {

        // open file with compounds
        // let tablePath = path.join(__dirname, '../../TurboPutative-2.0-built/TPProcesser/REname/data/preProcessedNames.tsv');
        // let compoundTable = fs.readFileSync(tablePath);

        // map to each compound
        let parsedArr = compoundArr.map( compound => {

            let compoundEscaped = compound.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let re = new RegExp (`^(${compoundEscaped})\t([^\n]+)$`, 'mi');
            let captured = re.exec(compoundTable);

            let parsed;
            if (captured === null)
            {
                parsed = compound;
                allRegex.forEach(element => {

                    let reDetect;
                    if (/\(\?i\)/.test(element[0])) // (?i) flag is not supported by javascript. Process it
                    {
                        reDetect = new RegExp (element[0].replace(/\(\?i\)/, ''), 'i');
                    } else {
                        reDetect = new RegExp (element[0]);
                    }

                    // \1 is not used as capturing group in replace. Instead, $1 is used... Replace it
                    let reReplace = /\\\d+/.test(element[1]) ? element[1].replace(/\\(\d+)/, '$$$1'): element[1];

                    parsed = parsed.replace(reDetect, reReplace);
                });

            } else {
                parsed = captured[2];
            }

            //let parsed = captured === null ? compound : captured[2];
            return parsed;
        });

        resolve (parsedArr);
    })

}

function classifyCompounds (compoundArr) {
    /*
    Input: Array with name of the compounds
    Output (resolve): Array of objects => {compound: name, tags: { food:bool, drug:bool... }}
    */
    return new Promise ( resolve => {

        // Tagging of compounds in list
        let tagsOfList = ['food', 'drug', 'microbial', 'natural_product', 'plant'];
        let tagsOfListBool = tagsOfList.map (function (tag) { return tagFromList (tag, compoundArr) });

        // Tagging halogenated
        let reHalogen = /([Ff]luor(?!ene)|[Cc]hlor(?!ophyl)|[Bb]rom|[Ii]od)/;
        tagsOfListBool.push( compoundArr.map( function(compound) { return reHalogen.test(compound); } ) );
        tagsOfList.push('halogen');

        // Tagging peptide
        let rePeptide = /^(Ala|Arg|Asn|Asp|Cys|Gln|Glu|Gly|His|Ile|Leu|Lys|Met|Phe|Pro|Ser|Thr|Trp|Tyr|Val|[-\s,]){3,}$/;
        tagsOfListBool.push( compoundArr.map( function(compound) { return rePeptide.test(compound); } ) );
        tagsOfList.push('peptide');

        // Generate Array of objects (compound with tags)
        let resObject = []; // array of object => {name: compund, tags: {food:bool ...}}
        for (let i=0; i<compoundArr.length; i++)
        {
            let compoundObject = {
                "name": compoundArr[i],
                "tags": {}
            };

            for (let j=0; j<tagsOfListBool.length; j++)
            {
                compoundObject.tags[tagsOfList[j]] = tagsOfListBool[j][i];
            }

            resObject.push(compoundObject);
        }

        resolve (resObject);
    })
}

function tagFromList (tag, compoundArr) {

    // path containing list files
    let listPath = path.join (__dirname, '../../TurboPutative-2.0-built/TPProcesser/Tagger/data');
    let tagList = fs.readFileSync (path.join (listPath, `${tag}_list.tsv`), 'utf-8');

    compoundBoolArr = compoundArr.map (function (compound) {
        let compoundEscaped = compound.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let re = new RegExp (`^${compoundEscaped}$`, 'mi');
        return re.test(tagList);
    })

    return compoundBoolArr;
}

// Export functions
module.exports.getParsedNames = getParsedNames;
module.exports.classifyCompounds = classifyCompounds;