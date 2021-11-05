#!bash/env node

function customCommand(args, reciever) {
    // args is an array of the command line input without the custom command
    //ex: $alex your_command 12 ../dir/file.ext/ -y => args = ['12', '../dir/file.ext/', '-y']
    // reciever is the path to the directory or file from where the command is called
    // hasFlags determines whether a flag is present. It supports combining flags
    //ex: $alex your_command -yl --da => 
    //hasFlags('-y', '--yes') => true; hasFlags('--da') => true; hasFlags('-p', '--present') => false; hasFlags('-l') => true

    function hasFlags(opt1, opt2) {
        if (opt2) {
            opt1 = opt1.replace('-','');
            let shortFlags = args.filter(flag => flags[0] === '-' && flag[1] !== '--');
            if (args.includes(opt2) || shortFlags.some(flag => flag.includes(opt1))) return true;
        } else if (opt1) {
            return args.includes(opt1);
        }
        return false;
    }
}

module.exports = customCommand;