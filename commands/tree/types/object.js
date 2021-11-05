const fs = require('fs');
const path = require('path');

function object(folderPath, filePath, isFile) {
    const treePath = {};
    let currentBranch = treePath;
    
    function logFiles(folder) {
        const folderName = path.basename(folder);
        currentBranch[folderName] = {};
        fs.readdirSync(folder).forEach(el => {
            let currentPath = path.resolve(folder, el);
            if (fs.lstatSync(currentPath).isDirectory()) {
                let oldBranch = currentBranch;
                currentBranch = currentBranch[folderName];// folder
                logFiles(currentPath);
                currentBranch = oldBranch;
            } else if (currentPath !== 1) {
                currentBranch[folderName][el] = !isFile ? el : fs.readFileSync(path.resolve(folder, el)).toString();// end file
            }
        });
    }
    logFiles(folderPath);
    return treePath[path.basename(folderPath)];
}

module.exports = object;