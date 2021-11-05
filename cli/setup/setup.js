#!/bash/env node
const cli = require('./cli.json');// acquired via `alex tree -fj`
const fs = require('fs');
const path = require('path');
let commandPath;

if (process.argv.includes('--help')) {
    return console.log(read(__dirname, '../', '../', 'documentation', 'setup.txt'));
} else if (process.argv[2] === '-l' || process.argv[2] === '--local') {
    const paths = require.main.paths;
    paths.reverse().forEach(el => fs.existsSync(el) && (commandPath = el));
    if (!commandPath) {
        fs.mkdirSync(paths[3], { recursive: true });
        commandPath = paths[3];
    }
} else {
    let paths = process.env.PATH.split(';').map(el => path.normalize(el));
    if (paths.some(el => el.includes('npm'))) {
        commandPath = paths.find(el => el.includes('npm'));
    } else {
        for (let i = 0; i < paths.length; i++) {
            if (fs.existsSync(paths[i]) && !commandPath)
            try {
                fs.writeFileSync(path.resolve(paths[i], 'temporaryFile'), '');
                fs.unlinkSync(path.resolve(paths[i], 'temporaryFile'));
                commandPath = paths[i];
            } catch (error) {}
        }
        if (!commandPath) return console.log(
            'No global paths with permission available, please create one.\n' + 
            'You can do that by editing the `system environment variable path`\n' +
            'For Windows see https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/'
        );
    }
}


const folderPath = path.resolve(process.env.APPDATA, 'cli')
const CLIPath = path.resolve(folderPath, 'cli')
if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

cli['utilities.js'] = cli['utilities.js']
    .replace('$callerPath', commandPath.replace(/\\/g, '\\\\'));
    .replace('$cliPath', folderPath.replace(/\\/g, '\\\\'));


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