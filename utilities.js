const fs = require("fs");
const path = require("path");

function hasFlags(opt1, opt2, args) {
    opt1 = opt1.replace('-','');
    let shortFlags = args.filter(flag => !flag.includes('--'));
    if (args.includes(opt2) || shortFlags.some(flag => flag.includes(opt1))) return opt1;
}

function getPaths(args) {
    return args.filter(el => exists(el));
}

function exists() {
    return fs.existsSync(path.resolve(...arguments));
}

function mkdir() {
    if (!exists(...arguments)) fs.mkdirSync(path.resolve(...arguments), {recursive: true});
}

function read() {
    return fs.readFileSync(path.resolve(...arguments)).toString();
}

function readdir() {
    return fs.readdirSync(path.resolve(...arguments));
}

function write(file, content) {
    fs.writeFileSync(path.resolve(...file), content);
}

function unlink() {
	fs.unlinkSync(path.resolve(...arguments));
}

function validateName(name) {
    if (!name) return console.log('no name is specified');
	if (name.length > 255) return console.log('the name is too long. it must be under 255 characters');
	if (new RegExp(/[<>:"/\\|?*\u0000-\u001F]/g).test(name) || new RegExp(/^(con|prn|aux|nul|com\d|lpt\d)$/i).test(name)) return console.log('the name should be a valid file name and should not include: <,>,:,",/,\\,|,?,*,-');
	if (name === '.' || name === '..') return console.log('the name cannot be . or ..');
    
    return true;
}// taken from https://github.com/sindresorhus/valid-filename

module.exports = {
    neverToDelete: ["uninstall", "reset"],
    callerpath: "$callerpath",
    clipath: "$clipath",
    mainCommand: "cli",
    oldCommand: "cli",
    validateName,
    hasFlags,
    getPaths,
    mkdir,
    readdir,
    exists,
    read,
    write,
    unlink
}