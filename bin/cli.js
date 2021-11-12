#!bash/env node
const path = require("path");
const cp = require('child_process');
const { readdir, exists, read, write, unlink, clipath, callerpath, mainCommand, oldCommand } = require("../utilities.js");

const args = process.argv[3] ? 
                process.argv[3].includes(' ') ? 	// to accept arguments from powershell as well
                    process.argv[3].split(/\s+/) : 
                process.argv.slice(3) : 
	         [''];
             
const reciever = process.argv[2];
let mainArg = args.find(el => el[0] !== '-') || false;// one of the available (init, add...) or custom commands
if (mainArg) args.splice(args.indexOf(mainArg), 1);
const flags = args.filter(el => el[0] === '-');

if (mainCommand !== oldCommand) {// delete files after rename
	write([clipath, 'utilities.js'], read(clipath, 'utilities.js').replace(`oldCommand: "${oldCommand}"`, `oldCommand: "${mainCommand}"`));
	unlink(callerpath, `${oldCommand}`);
	unlink(callerpath, `${oldCommand}.cmd`);
	unlink(callerpath, `${oldCommand}.ps1`);
}

const help = command => {
    let commandPath = path.resolve(__dirname, '../', 'commands', command, `${command}.txt`);
    let mainCommandPath = path.resolve(__dirname, '../', 'commands', `${mainCommand}.txt`);
    let errorPath = path.resolve(__dirname, '../', 'commands', `error.txt`);
    let text = '';

    if (command === 'error') {
        text = read(errorPath);
    } else if (command === '/?' || command === 'help') {
        text = read(mainCommandPath)
    } else if (exists(commandPath)) {
        text = read(commandPath);
    } else {
        if (!exists(clipath, 'commands', command)) {
            text = `\`${mainArg}\` is not a option of \`${mainCommand}\`. To see available options type \`${mainCommand}\``;
        } else {	
            text = `Wrong documentation path. There isn't a ${command}.txt in ${clipath}/commands/${command}`;
        }
    }
    text = text.replace(/(?<!\\)\$main_command/g, mainCommand).replace(/(?<!\\)\$clipath/g, clipath).replace(/\\\$main_command/g, '$mainCommand').replace(/\\\$clipath/g, '$clipath');
    console.log(text);
};

if (!mainArg) return help('/?');
if (flags.includes('--help') || args.includes('/?') || (mainArg === 'help' && !exists(__dirname, '../commands/help'))) return help(mainArg || mainCommand);

if (exists(__dirname, '../commands', mainArg)) {
    let ext = readdir(__dirname, '../commands', mainArg).find(el => el.startsWith(mainArg)).replace(mainArg, '');
    switch (ext) {
        case '.js':
            require(`../commands/${mainArg}/${mainArg}`)(args, reciever);
            break;
        case '.sh':
            console.log(path.join(__dirname, '../commands', mainArg, `${mainArg}.sh`));
            console.log(path.resolve(__dirname, '../commands', mainArg, `${mainArg}.sh`));
            console.log(path.normalize(__dirname, '../commands', mainArg, `${mainArg}.sh`));
            cp.execFile(path.normalize(__dirname, '../commands', mainArg, `${mainArg}.sh`))
            cp.execFile('./F:/Alex/VSC/custom-cli/commands/sh/sh.sh', console.log)
            // cp.execFile('/f/Alex/VSC/custom-cli/commands/sh/sh.sh', console.log)
            break;
        case '.cmd':
            break;
        case '.ps1':
            break;
        default:
            console.log(`wrong extension of ${mainArg}${ext} at ${clipath}/commands/${mainArg}`);
            break;
    }
} else {
    help(mainArg);
}