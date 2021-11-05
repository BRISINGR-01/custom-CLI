const fs = require('fs');
const path = require('path');
const { clipath, callerpath, mainCommand }

function uninstall() {    
    fs.rmSync(clipath, {recursive: true});
    fs.unlinkSync(path.resolve(callerpath, `${mainCommand}`));
    fs.unlinkSync(path.resolve(callerpath, `${mainCommand}.cmd`));
    fs.unlinkSync(path.resolve(callerpath, `${mainCommand}.ps1`));
}

module.exports = uninstall;