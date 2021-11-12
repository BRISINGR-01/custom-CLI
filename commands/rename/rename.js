const fs = require('fs');
const path = require('path');
const readline = require('readline');
const cp = require("child_process");
const { callerpath, clipath, mainCommand, validateName, read, write, readdir, exists } = require('../../utilities.js');


function rename(args) {
    const newName = args[0]?.trim();
	if (!newName) return console.log(read(__dirname, 'rename.txt').replace(/\$main_command/g, mainCommand));
    validateName(newName)
    
	let extensions = ['.exe', '.sh', '.cmd', '.ps1', ''];
	let newNameLowerCase = newName.toLowerCase();

	cp.exec(`${newName} /?`, (err, stdout, stderr) => {
		if (!stderr) return console.log(`\`${newName}\` is already a command, try another name`);
		if (process.env.PATH.split(';').filter(el => exists(el))
			.some(envPath => readdir(envPath)
				.filter(entry => {
					try {
						readdir(envPath, entry);
					} catch (err) {
						return true;
					}
				})
				.some(file => extensions.includes(path.parse(file).ext) && path.parse(file).name.toLowerCase() === newNameLowerCase))
			) return console.log(`\`${newName}\` is an executable file, try another name`);
	});
	
    const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
    });
    rl.question(`Are you sure you want to rename \`${mainCommand}\` to \`${newName}\`? (yes)`, input => {
		rl.close();
		if (input === 'y' || input === 'yes' || input === '') {
			write([callerpath, `${newName}`], read(callerpath, `${mainCommand}`));
			write([callerpath, `${newName}.cmd`], read(callerpath, `${mainCommand}.cmd`));
			write([callerpath, `${newName}.ps1`], read(callerpath, `${mainCommand}.ps1`));

			let text = `echo "This command is renamed. Use \'${newName}\'"`;
			write([callerpath, `${mainCommand}`], text);
			write([callerpath, `${mainCommand}.cmd`], text);
			write([callerpath, `${mainCommand}.ps1`], text);
		
			fs.renameSync(path.resolve(clipath, 'documentation', `${mainCommand}.txt`), path.resolve(clipath, 'documentation', `${newName}.txt`));
			write([__dirname, '../../', 'utilities.js'], read(__dirname, '../../', 'utilities.js').replace(`mainCommand: "${mainCommand}"`, `mainCommand: "${newName}"`));
		}   
    });		
}

module.exports = rename;