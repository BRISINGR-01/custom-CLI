const fs = require('fs');
const path = require('path');
const readline = require('readline');
const cp = require("child_process");
const { mainCommand, clipath, validateName, read, write, readdir, exists } = require('../../utilities.js');


function rename(args) {
    const newName = args[0]?.trim();
	if (!newName) return console.log(read(__dirname, 'rename.txt').replace(/\$main_command/g, mainCommand));
    validateName(newName)
    
	let extensions = process.env.PATHEXT.toLowerCase().split(';');
	let newNameLowerCase = newName.toLowerCase();

	// check if an executable with this name exists
	if (process.env.PATH.split(';').filter(el => exists(el))
		.some(envPath => readdir(envPath)
			.filter(entry => {// filter files
				try {
					readdir(envPath, entry);
				} catch (err) {
					return true;// if it can readdir it is a directory
				}
			})
			.some(file => extensions.includes(path.parse(file).ext) && path.parse(file).name.toLowerCase() === newNameLowerCase))
		) return console.log(`\`${newName}\` is an executable file, try another name`);

	cp.exec(`${newName} /?`, (err, stdout, stderr) => {
		if (!stderr) return console.log(`\`${newName}\` is already a command, try another name`);
			
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(`Are you sure you want to rename \`${mainCommand}\` to \`${newName}\`? (yes)`, input => {
			rl.close();
			if (input === 'y' || input === 'yes') {
				write([clipath, 'bin', `${newName}`], read(clipath, 'bin', `${mainCommand}`));
				write([clipath, 'bin', `${newName}.cmd`], read(clipath, 'bin', `${mainCommand}.cmd`));
				write([clipath, 'bin', `${newName}.ps1`], read(clipath, 'bin', `${mainCommand}.ps1`));
				
				let text = `This command is renamed. Use \'${newName}\'`;
				write([clipath, 'bin', `${mainCommand}`], `echo ${text}`);
				write([clipath, 'bin', `${mainCommand}.cmd`], `echo ${text}`);
				write([clipath, 'bin', `${mainCommand}.ps1`], `echo ${text}`);
			
				fs.renameSync(path.resolve(clipath, 'commands', `${mainCommand}.txt`), path.resolve(clipath, 'commands', `${newName}.txt`));
				write([clipath, 'utilities.js'], read(clipath, 'utilities.js').replace(`mainCommand: "${mainCommand}"`, `mainCommand: "${newName}"`));
			}   
		});		
	});
}

module.exports = rename;