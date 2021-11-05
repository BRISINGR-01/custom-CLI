const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const { mkdir, exists, write, read, readdir, hasFlags, getPaths } = require('../../utilities.js');

function initialize(args, reciever, hasNodemon) {
    reciever = getPaths(args)[0] || reciever;
    const allYes = hasFlags('-y', '--yes', args)
    const shouldKeepFiles = hasFlags('-k', '--keep', args);
    const completitions = readdir(reciever);
    const basedir = __dirname;
    let fileIndex = 0, extIndex = 0,userInput, pattern, suggestion;

    let templatePackage = read(basedir, 'templates', 'package.json');
    let templateNode = read(basedir, 'templates', 'init.js');
    let templateHTML = read(basedir, 'templates', 'index.html');
    let template404 = read(basedir, 'templates', '404.html');

    function isAllowed() {return !exists(...arguments) || !shouldKeepFiles}

    function fileCompleter(line) {
        if (!completitions.includes(line)) {
            userInput = line;
            fileIndex = 0;
        } else {
            fileIndex++
        }
        let hits = completitions.filter(completition => {
            if (pattern) {
                return completition.match(pattern);
            } else {
                return completition.toLowerCase().startsWith(userInput);
            }
        });
        hits.push(suggestion);
        if (hits.length === fileIndex) fileIndex = 0;
        
        return [[hits.length ? hits[fileIndex] : line], line];
    }
    function extensionCompleter(line) {
        if (!optionalExtensions.includes(line)) {
            userInput = line;
            extIndex = 0;
        } else {
            extIndex++
        }
        let hits = optionalExtensions.filter(ext => ext.toLowerCase().startsWith(userInput));
        if (hits.length === extIndex) extIndex = 0;
        return [[optionalExtensions[extIndex]], line];
    }


    if (args.includes('cli')) {
        const optionalExtensions = ['.js', '.sh', '.cmd', '.ps1'];
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: extensionCompleter
        });
        rl.question('what do you want the command to be: ', projectName => {
            if (allYes) {
                mkdir(reciever, projectName);
                if (isAllowed(reciever, projectName, `${projectName}.js`))
                    write([reciever, projectName, `${projectName}.js`], read(__dirname, `templates/customCommands/.js`));
                if (isAllowed(reciever, projectName, `${projectName}.txt`)) 
                    write([reciever, projectName, `${projectName}.txt`], read(__dirname, `templates/customCommands/.txt`));
                rl.close();
            } else {
                function ask() {
                    rl.question('type of file to be executed: ', ext => {
                        if (!optionalExtensions.includes(ext)) {
                            console.log('please select one of the suggested extensions: ' + optionalExtensions.join(', '));
                            return ask();
                        };

                        mkdir(reciever, projectName);
                        if (isAllowed(reciever, projectName, `${projectName}${ext}`)) 
                            write([reciever, projectName, `${projectName}${ext}`], read(__dirname, `templates/customCommands/${ext}`));
                        if (isAllowed(reciever, projectName, `${projectName}.txt`)) 
                            write([reciever, projectName, `${projectName}.txt`], read(__dirname, `templates/customCommands/.txt`));
                        rl.close();
                    });
                }
                ask();
            }
        });
    } else {
        if (allYes) {
            let projectName = path.basename(reciever);
            mkdir(reciever, 'public');
            mkdir(reciever, 'helpers');

            templatePackage = templatePackage
                .replace('project_name', projectName.toLowerCase().replace(/\s/g, '_'))
                .replace('node', hasNodemon ? 'nodemon' : 'node');
            templateHTML = templateHTML.replace('New Project', projectName);

            if (isAllowed(reciever, 'init.js')) write([reciever, 'init.js'], templateNode);
            if (isAllowed(reciever, 'package.json')) write([reciever, 'package.json'], templatePackage);
            if (isAllowed(reciever, 'public', 'index.html')) write([reciever, 'public', 'index.html'], templateHTML);
            if (isAllowed(reciever, 'public', '404.html')) write([reciever, 'public', '404.html'], template404);

            readdir(basedir, 'helpers').forEach(file => {
                if (isAllowed(basedir, 'helpers', file)) 
		    write([reciever, 'helpers', file], read(basedir, 'helpers', file));
            });
        } else {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                completer: fileCompleter
            });
            suggestion = path.basename(reciever);
            pattern = false;
            rl.write(suggestion);
            rl.question("project name: ", name => {
                templateHTML = templateHTML.replace('New Project', name);
                name = name.toLowerCase().replace(/\s/g, '_');
                templatePackage = templatePackage.replace('project_name', name);

                suggestion = 'init.js';
                pattern = new RegExp(/.*\.js/);
                if (isAllowed(reciever, 'index.js') && exists(reciever, 'index.js')) suggestion = 'index.js';
                if (isAllowed(reciever, 'app.js') && exists(reciever, 'app.js')) suggestion = 'app.js';
                rl.write(suggestion);

                rl.question("node server: ", nodeFilePath => {
                    templatePackage = templatePackage
                        .replace('init.js', nodeFilePath)
                        .replace('node', hasNodemon ? 'nodemon' : 'node');
                    mkdir(nodeFilePath, '../');

                    if (isAllowed(reciever, 'index.html') && exists(reciever, 'index.html')) suggestion = 'index.html';
                    if (isAllowed(reciever, 'landingPage.html') && exists(reciever, 'landingPage.html')) suggestion = 'landingPage.html';
                    suggestion = 'public/index.html';
                    pattern = new RegExp(/.*\.html/);
                    rl.write(suggestion);

                    rl.question("landing page: ", htmlFilePath => {
                        templatePackage = templatePackage.replace('public/index.html', htmlFilePath);
                        mkdir(htmlFilePath, '../');

                        mkdir(reciever, 'public');
                        mkdir(reciever, 'helpers');
                        if (isAllowed(reciever, 'package.json')) write([reciever, 'package.json'], templatePackage);
                        if (isAllowed(reciever, nodeFilePath)) write([reciever, nodeFilePath], templateNode);
                        if (isAllowed(reciever, htmlFilePath)) write([reciever, htmlFilePath], templateHTML);
                        if (isAllowed(reciever, 'public', '404.html')) write([reciever, 'public', '404.html'], template404);
                        readdir(basedir, 'helpers').forEach(file => {
                            if (isAllowed(basedir, 'helpers', file)) write([reciever, 'helpers', file], read(basedir, 'helpers', file));
                        });

                        rl.close();
                    });
                });
            });
        }
    }
}

module.exports = (args, reciever) => exec('npm list -g', (error, stdout, stderr) => initialize(args, reciever, stdout.includes('nodemon')));
