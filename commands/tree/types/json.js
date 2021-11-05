
function json(folder, file, isFile) { 
    const object = require('./object')(folder, file, isFile);
    return JSON.stringify(object);
}

module.exports = json;