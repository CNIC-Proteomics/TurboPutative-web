// Read regex file //

const fs = require('fs');
const path = require('path');

// get path
pathToRegex = path.join(__dirname, "../../TurboPutative-2.0-built/TPProcesser/REname/data/regex.ini");

// read file and split
regexFileLine = fs.readFileSync(pathToRegex, 'utf-8').split("\n");

let section = 0
let regexPair = [];
let allRegex = [];
for (let line of regexFileLine)
{
    if (/^$/.test(line) || /^\s*#/.test(line))
    {
        continue;
    }

    if(/^\[[^\[\]]+\]\s*$/.test(line) && section==0)
    {
        section++;
        continue;
    }

    regexObj = /^([^=]+?)\s*=\s*(.*?)$/.exec(line);
    if (regexObj && (section==1 || section==2))
    {
        regexPair.push(regexObj[2]);
        section++;

        if (section == 3)
        {
            allRegex.push(regexPair);
            regexPair = [];
            section = 0;
        }

        continue;
    }
}

console.log ("** File containing regular expressions was read");

// Export object with regex
module.exports = allRegex