This command-line interface consists of custom utilities aimed mainly to save time.

In order to use it you need to install and run the installer, after which (you might need to restart any open terminals first) you need to type 'alex' and the deired command in a terminal.
For more information type 'alex --help' or any other command combination with the '--help' flag.

Available commands:
alex init -y/--yes -k/--keep

The cli works as I edited the user and system environment variable PATH (the $PATH var from bash or path command on cmd) by adding the folder I want the cmd and bash to look into for commands, then in that folder I made two files with the name of the custom command with .exe and .cmd extensions:
    bash executes .exe, .sh or plain file with no extension
    cmd executes .cmd

After editing the system variables the terminal(s) need to be restarted.
