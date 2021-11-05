const fs = require('fs');
const path = require('path');

function object(folderPath) {
    const treePath = [];
    let currentBranch = treePath;
    
    function logFiles(folder) {
        const folderName = path.basename(folder);
        
        fs.readdirSync(folder).forEach(el => {
            let currentPath = path.resolve(folder, el);
            if (fs.lstatSync(currentPath).isDirectory()) {
                let oldBranch = currentBranch;
                currentBranch = [];
                oldBranch.push(currentBranch);
                logFiles(currentPath);// folder
                currentBranch = oldBranch;
            } else {
                currentBranch.push(el);// end file
            }
        });
    }
    logFiles(folderPath);
    return treePath;
}

module.exports = object;