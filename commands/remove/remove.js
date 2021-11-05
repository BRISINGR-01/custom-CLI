const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { neverToDelete, clipath, mainCommand, mkdir, exists, readdir, write, read } = require('../../utilities.js');

function remove(args, caller) {
    const command = args[0];
    if (!command) return console.log(read(__dirname, 'remove.txt').replace('$main_command', mainCommand));
    if (!exists(clipath, 'commands', command)) return console.log(`there is no such command \`${command}\``);
    if (neverToDelete.includes(command)) return console.log(`You can't delete the following commands: ${neverToDelete.join(', ')}`);
    	
    const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
    });
    rl.question(`Are you sure you want to permanently delete \`${command}\`? (yes)`, input => {
	rl.close();
	if (input === 'y' || input === 'yes' || input === '')
	    fs.rmSync(path.resolve(clipath, 'commands', command), {recursive: true});
    });
}

module.exports = remove;