const fs = require('fs');
const path = require('path');

function file(reciever, folder, file, result, isJSON) {
    if (!isJSON) result = JSON.stringify(result);
    if (!file) file = path.resolve(reciever, `${path.basename(folder)}.json`);
    fs.writeFileSync(file, result);
}

module.exports = file;