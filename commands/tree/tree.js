const fs = require('fs');
const path = require('path');
const { rootCertificates } = require('tls');

function tree(args, reciever) {
    const flags = args.filter(el => el[0] === '-');
    let folder = args.find(el => fs.existsSync(path.resolve(reciever, el))) || reciever;
        folder = path.resolve(folder);// so that when you pass ../../, the name wouldn't be ..
    let file = args.find(opt => opt[0] !== '-' && path.resolve(opt) !== folder);

    function hasFlags(opt1, opt2) {
        opt1 = opt1.replace('-','');
        let shortFlags = flags.filter(flag => !flag.includes('--'));
        if (flags.includes(opt2) || shortFlags.some(flag => flag.includes(opt1))) return opt1;
    }
    if (fs.lstatSync(folder).isFile()) {
        let name = path.basename(folder);
        if (hasFlags('-s', '--spaces')) {
            console.log(name);
        } else if (hasFlags('-o', '--object')) {
            let object = {}
            object[name] = name;
            console.log(object);
        } else if (hasFlags('-j', '--json')) {
            object = JSON.stringify(object);
            console.log(object);
        } else if (hasFlags('-a', '--array')) {
            console.log([name]);
        } else if (!hasFlags('-f', '--file')){
            console.log(name);
        } else {
            let object = {}
            object[name] = name;
            let file = options.find(opt => opt[0] !== '-' && opt !== folder) || path.resolve(reciever, `${path.parse(folder).name}.json`);
            fs.writeFileSync(file, JSON.stringify(object))
        }
        return; 
    }
    const isFile = hasFlags('-f', '--file');
    let result = require('./types/json')(folder, file, isFile);
    let isJSON = true;
    
    if (hasFlags('-s', '--spaces') || !isFile) {
        let num = Number(args.find(el => !isNaN(Number(el))));
        isJSON = false;
        result = require('./types/spaces')(folder, num);
    } else if (hasFlags('-o', '--object')) {
        isJSON = false;
        result = require('./types/object')(folder, file, isFile);
    } else if (hasFlags('-j', '--json')) {
        result = require('./types/json')(folder, file, isFile);
    } else if (hasFlags('-a', '--array')) {
        isJSON = false;
        result = require('./types/array')(folder);
    }
    
    if (isFile) {
        require('./file')(reciever, folder, file, result, isJSON);
    } else {
        console.log(result);
    }
}

module.exports = tree;