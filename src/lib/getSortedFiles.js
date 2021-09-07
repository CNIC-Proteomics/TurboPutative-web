const fs = require("fs");

function getSortedFiles(basePath)
{
    const fs = require("fs"),
    // basePath = "C:/Users/SomeUser/Documents",
    directoryContent = fs.readdirSync(basePath);

    let files = directoryContent.filter((filename) => {
        return fs.statSync(`${basePath}/${filename}`).isFile();
    });

    let sorted = files.sort((a, b) => {
        let aStat = fs.statSync(`${basePath}/${a}`),
            bStat = fs.statSync(`${basePath}/${b}`);
        
        return new Date(bStat.birthtime).getTime() - new Date(aStat.birthtime).getTime();
        });

    // console.log(sorted);
    
    return sorted;
}

module.exports = getSortedFiles;