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

module.exports = {
    neverToDelete: ["uninstall", "reset"],
    callerpath: "C:\\Users\\University\\AppData\\Local\\Microsoft\\WindowsApps", //$callerpath
    clipath: "F:\\ALEX\\VSC\\CLI", //$clipath
    mainCommand: "alex",
    oldCommand: "alex",
    resetCooldown: "Fri Nov 05 2021 22:41:53 GMT+0200 (Източноевропейско стандартно време)",
    hasFlags,
    getPaths,
    mkdir,
    readdir,
    exists,
    read,
    write,
    unlink
}