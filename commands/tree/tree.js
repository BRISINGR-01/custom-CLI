const fs = require('fs');
const path = require('path');
const { write, getPaths, hasFlags } = require('../../utilities.js');

function tree(args, reciever) {
    const flags = args.filter(el => el[0] === '-');
    const paths =  getPaths(args);
    let folder = paths.find(el => fs.lstatSync(el).isDirectory()) || reciever;
	folder = path.resolve(folder);
    let file = paths.find(el => fs.lstatSync(el).isFile()) || 
	 	args.find(el => el[0] !== '-') ||
		reciever + '/' + `${path.parse(folder).name}.json`;
	file = path.resolve(reciever, file);

    const isFile = hasFlags('-f', '--file', args);
    
    if (hasFlags('-o', '--object', args) || isFile) {
        result = require('./types/object')(folder, file, isFile);
    } else if (hasFlags('-j', '--json', args)) {
        result = require('./types/object')(folder, file, isFile);
	result = JSON.stringify(result);
    } else if (hasFlags('-a', '--array', args)) {
        result = require('./types/array')(folder, file, isFile);
    } else {// default is --space
        let num = Number(args.find(el => !isNaN(Number(el))));
        result = require('./types/spaces')(folder, num);
    }
    
    if (isFile) {
        if (typeof result === 'object') result = JSON.stringify(result);

	write([file], result);
    } else {
        console.log(result);
    }
}

module.exports = tree;