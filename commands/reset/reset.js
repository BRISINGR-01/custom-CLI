const https = require("https");
let { clipath, resetCooldown, write, read } = require("../../utilities");
const readline = require("readline");

function reset(flag) {
    resetCooldown = new Date(resetCooldown) - new Date();
    if (resetCooldown < 0) resetCooldown = 0;
    if (!flag && resetCooldown) {
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
                //reset
            };
        });
    } else {
        write([clipath, 'utilities.js'], read(clipath, 'utilities.js').replace(/resetCooldown.+/, `resetCooldown: "${new Date(+new Date() + +new Date(20000))}",`));
        //reset
    }
    return;

    https.get('https://raw.githubusercontent.com/brisingr-01/custom-CLI/master/Geometry.html', res => {
        let body = '';
        res.on('data', d => body += d.toString());
        res.on('end', () => cb(body));
    });
    var files = [];

    https.get({
        host: 'api.github.com',
        path: '/repos/brisingr-01/3d-geometry/contents/public',
        headers: {'User-Agent': 'get-file node.js application'}
    }, res => {
        let body = '';

        res.on('data', chunk => body += chunk);

        res.on('end', () => {
            let list = JSON.parse(body);
            for (let i = 0; i < list.length; ++i) {
            	files.push(list[i]);
            }
            cb(files);
        });
    });
}

module.exports = reset;
reset();