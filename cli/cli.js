#!bash/env node
const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const { readdir, exists, read, write, unlink, clipath, callerpath, mainCommand, oldCommand } = require("../utilities.js");

const args = process.argv[3] ? 
                process.argv[3].includes(' ') ? 	// to accept arguments from powershell as well
                    process.argv[3].split(/\s+/) : 
                process.argv.slice(3) : 
	         [''];
const reciever = process.argv[2];
let main_command = args.find(el => el[0] !== '-') || false;
if (main_command) args.splice(args.indexOf(main_command), 1);
const flags = args.filter(el => el[0] === '-');

if (mainCommand !== oldCommand) {// delete files after rename
	write([clipath, 'utilities.js'], read(clipath, 'utilities.js').replace(`oldCommand: "${oldCommand}"`, `oldCommand: "${mainCommand}"`));
	unlink(callerpath, `${oldCommand}`);
	unlink(callerpath, `${oldCommand}.cmd`);
	unlink(callerpath, `${oldCommand}.ps1`);
}

const help = command => {
    command = command === '/?' ? mainCommand : command;
    let docPath = path.resolve(__dirname, '../', 'documentation', `${command}.txt`);
    let commandPath = path.resolve(__dirname, '../', 'commands', command, `${command}.txt`);
    let text = '';
    if (exists(docPath)) {
        text = read(docPath);
    } else if (exists(commandPath)) {
        text = read(commandPath);
    } else {
        if (!exists(clipath, 'commands', command)) {
            text = read(__dirname, '../', 'documentation', `error.txt`);
        } else {	
            text = `Wrong documentation path. Perhaps at \`${mainCommand} add\` you haven\'t included a ${command}.txt`;
        }
    }
    text = text.replace(/(?<!\\)\$main_command/g, mainCommand).replace(/(?<!\\)\$clipath/g, clipath).replace(/\\\$main_command/g, '$mainCommand').replace(/\\\$clipath/g, '$clipath');
    console.log(text);
};
if (!main_command) return help(mainCommand);
if (flags.includes('--help') || args.includes('/?') || main_command === '/?') return help(main_command || mainCommand);

if (exists(__dirname, '../commands', main_command)) {
    let ext = readdir(__dirname, '../commands', main_command).find(el => el.startsWith(main_command)).replace(main_command, '');
    switch (ext) {
        case '.js':
            require(`../commands/${main_command}/${main_command}`)(args, reciever);
            break;
        case '.sh':
            break;
        case '.cmd':
            break;
        case '.ps1':
            break;
        default:
	    console.log(`wrong extension at \`${mainCommand} add\``);
	    console.log(`try \`&{mainCommand} add --help\``);
            break;
    }
} else {
    help('error');
}