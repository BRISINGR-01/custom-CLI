#!/bash/env node
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const cli = require('./cli.json');// acquired via `cli tree -f`

const args = process.argv[2] ? 
                process.argv[2].includes(' ') ?
                    process.argv[2].split(/\s+/) : 
                process.argv.slice(2) : 
	         [''];

if (args.includes('--help') || args.includes('/?')) return console.log(`Installs the cli - https://github.com/BRISINGR-01/custom-CLI`);
function write(file, content) {
    try {
        return fs.writeFileSync(path.resolve(...file), content);
    } catch (err) {}
}
function mkdir() {
    if (!fs.existsSync(path.resolve(...arguments))) fs.mkdirSync(path.resolve(...arguments), { recursive: true });
}
cp.exec('npm root -g', (error, stdout, stderr) => {
    let callerPath, cliPath;
    
    if (args.includes('-l') || args.includes('--local')) cliPath = __dirname;
    
    const npmPath = path.normalize(stdout).replace(/[\r\n]/, '');
    callerPath = path.resolve(npmPath, '../');
    cliPath = path.resolve(cliPath || npmPath, 'custom-cli');

    cli['utilities.js'] = cli['utilities.js']
        .replace('$callerpath', callerPath.replace(/\\/g, '\\\\'))
        .replace('$clipath', cliPath.replace(/\\/g, '\\\\'));

    write([callerPath, 'cli'],     cli.bin['cli']    .replace('$clipath', cliPath.replace(/\\/g, '\\\\')));
    write([callerPath, 'cli.cmd'], cli.bin['cli.cmd'].replace('$clipath', cliPath.replace(/\\/g, '\\\\')));
    write([callerPath, 'cli.ps1'], cli.bin['cli.ps1'].replace('$clipath', cliPath.replace(/\\/g, '\\\\')));


    let parsePath = cliPath;
    mkdir(cliPath);
    function parseFolder(obj) {
        Object.entries(obj).forEach(el => {
            if (typeof el[1] === 'object' && el[0] !== 'cli.json') {
                parsePath = path.resolve(parsePath, el[0]);
                parseFolder(el[1]);
                parsePath = path.resolve(parsePath, '../');
            } else {
                mkdir(parsePath);
                fs.writeFileSync(path.resolve(parsePath, el[0]), el[1]);
            }
        });
    }
    parseFolder(cli);
});