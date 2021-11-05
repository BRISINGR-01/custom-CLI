const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { mainCommand, clipath, neverToDelete, exists, write, read, readdir, mkdir} = require('../../utilities.js');

function add(args, caller) {
	const paths = args.filter(el => exists(el));
    caller = paths[0] || caller;
    let command = path.basename(caller);
    let question = exists(clipath, 'commands', command) ? `${command} already exists. Do you want to replace it? (yes)` : `Do you want to add \`${command}\` to the \`${mainCommand}\` cli? (yes)`;

    if (neverToDelete.includes(command)) return console.log(`You can't delete or overwrite the following commands: ${neverToDelete.join(', ')}`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: line => [['yes'], line]
    });

    rl.question(question, input => {
        rl.close();
        input = input.trim();
        if (input === 'y' || input === 'yes' || input === '') {
			const extentions = ['.js', '.sh', '.ps1', '.cmd'];
			if (!exists(caller, `${command}.txt`)) 
				return console.log(`The ${command}.txt file is missing. Try \`${mainCommand} add --help\` for more information`);
			if (!fs.readdirSync(caller).some(file => extentions.some(ext => file === `${command}${ext}`))) 
				return console.log(`The ${command} file with ${extentions.join('/')} extension is missing. Try \`${mainCommand} add --help\` for more information`);
			
			mkdir(clipath, 'commands', command);
			let destination = path.resolve(clipath, 'commands', command);
			let currentPath = caller;
			function copyFolder(folder) {
				readdir(folder).forEach(el => {
					currentPath = path.resolve(folder, el);
					if (fs.lstatSync(currentPath).isDirectory()) {
						destination = path.resolve(destination, el);
						mkdir(destination);
						copyFolder(currentPath);
						destination = path.resolve(destination, '../');
					} else {
						write([destination, el], read(currentPath));
					}
				});
			}
			copyFolder(caller);
        } else {
			console.log(`For more information type \`${mainCommand} add --help\` or visit https://github.com/BRISINGR-01/custom-CLI#Adding-cusotm-commands`)
		}
    });
}

module.exports = add;