const fs = require('fs');
const path = require('path');
const { readdir, read } = require('../../../utilities.js');

function object(folderPath, filePath, isFile) {
    const treePath = {};
    let currentBranch = treePath;
    
    function logFiles(folder) {
        const folderName = path.basename(folder);
        currentBranch[folderName] = {};
        readdir(folder).forEach(el => {
            let currentPath = path.resolve(folder, el);
            if (fs.lstatSync(currentPath).isDirectory()) {
                let oldBranch = currentBranch;
                currentBranch = currentBranch[folderName];// folder
                logFiles(currentPath);
                currentBranch = oldBranch;
            } else {
                currentBranch[folderName][el] = !isFile ? el : read(folder, el);// end file
            }
        });
    }
    logFiles(folderPath);
    return treePath[path.basename(folderPath)];
}

module.exports = object;