#!bash/env node

function customCommand(args, reciever) {
    // args is an array of the command line input without the custom command
    //ex: $cli your_command 12 ../dir/file.ext/ -y => args = ['12', '../dir/file.ext/', '-y']
    // reciever is the path to the directory or file from where the command is called
}

module.exports = customCommand;