const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { mainCommand, clipath, neverToDelete, validateName, exists, write, read, readdir, mkdir} = require('../../utilities.js');

function add(args, caller) {
	const extentions = ['.js', '.sh', '.ps1', '.cmd'];
	let newCommand = args[0];

    if (neverToDelete.includes(newCommand)) return console.log(`You can't delete or overwrite the following commands: ${neverToDelete.join(', ')}`);
	if (!newCommand) return console.log(read(__dirname, 'add.txt').replace(/\$main_command/g, mainCommand));
	if (!validateName(newCommand)) return;

	let suggestedPath = readdir(caller).find(el => el.toLowerCase() === newCommand.toLowerCase());
	suggestedPath = suggestedPath && path.resolve(caller, suggestedPath);

    let question = exists(clipath, 'commands', newCommand) ? `\'${newCommand}\' already exists. Do you want to replace it? (yes)` : `Do you want to add \`${newCommand}\` to the \`${mainCommand}\` cli? (yes)`;


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: line => [['yes'], line]
    });

    rl.question(question, input => {
		input = input.trim();
        if (input === 'y' || input === 'yes' || input === '') {
			rl.write(suggestedPath || caller);
			rl.question('folder with the cli project:', folderPath => {

				if (!folderPath || !exists(folderPath)) 
					return console.log('invalid path');
				if (!exists(folderPath, `${newCommand}.txt`)) 
					return console.log(`The ${newCommand}.txt file is missing. Try \`${mainCommand} add --help\` for more information`);
				if (!readdir(folderPath).some(file => extentions.some(ext => file === `${newCommand}${ext}`))) 
					return console.log(`The ${newCommand} file with ${extentions.join('/')} extension is missing. Try \`${mainCommand} add --help\` for more information`);

				
				mkdir(clipath, 'commands', newCommand);
				let destination = path.resolve(clipath, 'commands', newCommand);
				let currentPath = folderPath;
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
				copyFolder(folderPath);
				rl.close();
			});
        } else {
			console.log(`For more information type \`${mainCommand} add --help\` or visit https://github.com/BRISINGR-01/custom-CLI#Adding-cusotm-commands`)
			rl.close();
		}
    });
}

module.exports = add;