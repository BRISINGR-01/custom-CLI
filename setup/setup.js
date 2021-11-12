#!/bash/env node
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const cli = require('./cli.json');// acquired via `alex tree -fj`
let commandPath;
const args = process.argv[2] ? 
                process.argv[2].includes(' ') ?
                    process.argv[2].split(/\s+/) : 
                process.argv.slice(2) : 
	         [''];

function setUp() {
    cp.exec('npm root -g', (error, stdout, stderr) => {
        const clipath = path.normalize(stdout);
        const callerpath = path.resolve(clipath, '../')
        console.log(clipath, callerpath);
    });
}
if (args.includes('--help') || args.includes('/?')) {
    return console.log(`sets up the cli by adding three files (for bash, ps1 and cmd) in a folder from the environment variable 'path' or in a node_modules folder\n\nflags:\n-l/--local      instead of globally, the cli is installed in a node_modules folder`);
} else if (args.includes('-l') || args.includes('--local')) {
    const paths = require.main.paths;
    paths.reverse().forEach(el => fs.existsSync(el) && (commandPath = el));
    if (!commandPath) {
        fs.mkdirSync(paths[3], { recursive: true });
        commandPath = paths[3];
        setUp();
    }
} else {
    setUp();
}

return;
const folderPath = path.resolve(process.env.APPDATA, 'cli');
const CLIPath = path.resolve(folderPath, 'cli');
if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

cli['utilities.js'] = cli['utilities.js']
    .replace('$callerPath', commandPath.replace(/\\/g, path.sep))
    .replace('$cliPath', folderPath.replace(/\\/g, path.sep));


write([commandPath, 'alex'],     cli.cli.commands['alex']);
write([commandPath, 'alex.cmd'], cli.cli.commands['alex.cmd']);
write([commandPath, 'alex.ps1'], cli.cli.commands['alex.ps1']);


let parsePath = folderPath;
function parseFolder(obj) {
    Object.entries(obj).forEach(el => {
        if (typeof el[1] === 'object') {
            parsePath = path.resolve(parsePath, el[0]);
            parseFolder(el[1]);
            parsePath = path.resolve(parsePath, '../');
        } else {
            if (!fs.existsSync(parsePath)) fs.mkdirSync(parsePath);
            fs.writeFileSync(path.resolve(parsePath, el[0]), el[1]);
        }
    });
}
parseFolder(cli);