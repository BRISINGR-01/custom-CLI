const fs = require('fs');
const path = require('path');
const { readdir } = require('../../../utilities.js');

function spaces(folderPath, num) {
    let indent = 0, dif = num || 4, text = '';
    
    function logFiles(folder) {
        const folderName = path.basename(folder);
        let indention = ' '.repeat(indent);
        text += `${indention} ${folderName}\n`;
        indent += dif;
        readdir(folder).forEach(el => {
            let currentPath = path.resolve(folder, el);
            if (fs.lstatSync(currentPath).isDirectory()) {
                logFiles(currentPath);// folder
            } else {
                indention = ' '.repeat(indent);
                text += `${indention} ${el}\n`;// end file
            }
        });
        return indent -= dif
    }
    logFiles(folderPath);  
    return text;
}

module.exports = spaces