const fs = require('fs');
const path = require('path');
const cli = require('./cli.json');
const readline = require('readline');

function write(file, content) {
    try {
        return fs.writeFileSync(path.resolve(...file), content);
    } catch (err) {}
}
function mkdir() {
    if (!fs.existsSync(path.resolve(...arguments))) fs.mkdirSync(path.resolve(...arguments), {recursive: true});
}

async function reset() {
    const stats = fs.lstatSync(path.resolve(__dirname, 'cli.json'));
    clipath = path.resolve(__dirname, '../../');

    if (stats.birthtime - stats.mtime !== 0) {
	    const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: line => [['yes'], line]
        });

        clipath = await new Promise((resolve, reject) => rl.question('You have altered the files! Do you wish to continue (yes)', input => {
	        rl.close();
	        if (!(input === 'yes' || input === 'y')) {
		        console.log('Please redownload the cli from https://github.com/BRISINGR-01/custom-CLI')
		        resolve(false);
	        }
	        resolve(clipath);
	    }));
    }
    if (!clipath) return;

    fs.rmSync(clipath, {recursive: true});
    mkdir(clipath);

    let currentPath = clipath;

    function pasteFolder(entry) {
        Object.entries(entry).forEach(el => {
            if (typeof el[1] === 'object' && el[0] !== 'cli.json') {
                currentPath = path.resolve(currentPath, el[0]);
                pasteFolder(el[1]);
                currentPath = path.resolve(currentPath, '../');
            } else {
                mkdir('../', currentPath);
                write([currentPath, el[0]], el[1]);
            }
        });
    }
    pasteFolder(cli);
    write([__dirname, 'cli.json'], JSON.stringify(cli));
}

module.exports = reset;