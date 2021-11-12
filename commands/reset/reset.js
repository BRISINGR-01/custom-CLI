const https = require("https");
const readline = require("readline");
const fs = require('fs');
const path = require('path');
let { clipath, resetCooldown, write, read } = require("../../utilities");

function checkCooldown() {
    return new Promise((resolve, reject) => {
        console.log(1);
        resetCooldown = new Date(resetCooldown) - new Date();
        if (resetCooldown < 0) resetCooldown = 0;
        if (resetCooldown) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            let minutes = Math.floor(resetCooldown / 60000);
            let seconds = Math.floor((resetCooldown % 60000) / 1000);
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            rl.question(`There is a cooldown on this command to prevent overuse of the github cli. ${minutes}:${seconds} minutes are left. Do you want to reset anyways (yes)`, input => {
                rl.close();
                if (input === 'yes' || input === 'y') {
                    write([clipath, 'utilities.js'], read(clipath, 'utilities.js').replace(/resetCooldown.+/, `resetCooldown: "${new Date(+new Date() + +new Date(20000))}",`));
                    resolve(true);
                } else {
                    resolve('false');
                };
            });
        } else {
            write([clipath, 'utilities.js'], read(clipath, 'utilities.js').replace(/resetCooldown.+/, `resetCooldown: "${new Date(+new Date() + +new Date(20000))}",`));
            resolve(true);
        }
    });
}

async function getFiles() {
    new Promise((resolve, reject) => {
        function options(link = '/repos/brisingr-01/custom-CLI/contents') {
            return {
                host: 'api.github.com',
                path: link,
                headers: {'User-Agent': 'get-file node.js application'}
            }
        }
        const fileTree = {};
        let currentBranch = fileTree;
    
    
        async function extractRepo(link) {
            return new Promise((resolve, reject) => {
                https.get(options(link), res => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
            
                    res.on('end', () => {
                        JSON.parse(body).map(el => {
                            let name = el.url.replace('https://api.github.com/repos/BRISINGR-01/custom-CLI/contents/', '').replace('?ref=main', '');
                            if (el.type === 'file') {
                                currentBranch[name] = name
                                console.log(name);
                                resolve(fileTree);
                            } else {
                                console.log(name);
                                let oldBranch = currentBranch;
                                currentBranch = currentBranch[name];
                                extractRepo(el.url);
                                currentBranch = oldBranch;
                            }
                        });
                    });
                });
            })
        }
        extractRepo()
    })
}

async function reset() {
    console.log(getFiles())
    const stats = fs.lstatSync(path.resolve(__dirname, 'cli.json'));
    if (stats.birthtime - stats.mtime === 0) {// if it isn't modified
        return;
    }

    // const noCooldown = await checkCooldown();
    // if (noCooldown) {
    //     return;
    // }

    // return console.log(noCooldown, isNotModified);
}

module.exports = reset;