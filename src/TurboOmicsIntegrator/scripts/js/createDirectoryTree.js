const fs = require('fs-extra');
const path = require('path');

// Define the directory structure with any depth
const directoryStructure = {
    CMM_TP: {
        pos: {},
        neg: {}
    },
    EDA: {
        xPreProcessing: {},
        PCA: { q: {}, m: {}, t: {} }
    },
    MOFA: {},
    GSEA: { q: {}, m: {}, t: {} },
    tmp: {}
};

function createDirectoryTree(rootFolder) {

    // Check if the root folder exists and remove it if it does
    if (fs.existsSync(rootFolder)) {
        fs.rmSync(rootFolder, { recursive: true, force: true });
    }

    function recursivelyCreateDirectory(myPath, structure) {
        fs.mkdirSync(myPath, { recursive: true });

        for (const subdirectory in structure) {
            const subdirectoryPath = path.join(myPath, subdirectory);
            if (typeof structure[subdirectory] === 'object') {
                recursivelyCreateDirectory(subdirectoryPath, structure[subdirectory]);
            }
        }
    }

    recursivelyCreateDirectory(rootFolder, directoryStructure);
}

module.exports = createDirectoryTree;

// Call the function with the root folder name and the directory structure
//createDirectoryTree('myRootFolder', directoryStructure);
