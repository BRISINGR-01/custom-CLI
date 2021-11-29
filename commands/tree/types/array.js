const fs = require('fs');
const path = require('path');
const { readdir, read } = require('../../../utilities.js');

function object(folderPath, file, isFile) {
    const treePath = [];
    let currentBranch = treePath;
    
    function logFiles(folder) {
        const folderName = path.basename(folder);
        
        readdir(folder).forEach(el => {
            let currentPath = path.resolve(folder, el);
            if (fs.lstatSync(currentPath).isDirectory()) {
                let oldBranch = currentBranch;
                currentBranch = [];
                oldBranch.push(currentBranch);
                logFiles(currentPath);// folder
                currentBranch = oldBranch;
            } else if (el !== file) {
                currentBranch.push(el);// end file
            }
        });
    }
    logFiles(folderPath);
    return treePath;
}

module.exports = object;