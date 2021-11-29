# custom-CLI

This cli consists of a couple of predefined commands and allows users to easily add new commands
Available commands
- [init](https://github.com/BRISINGR-01/custom-CLI#init)
- [tree](https://github.com/BRISINGR-01/custom-CLI#tree)
- [add](https://github.com/BRISINGR-01/custom-CLI#add)
- [remove](https://github.com/BRISINGR-01/custom-CLI#remove)
- [reset](https://github.com/BRISINGR-01/custom-CLI#reset)
- [rename](https://github.com/BRISINGR-01/custom-CLI#rename)
- [uninstall](https://github.com/BRISINGR-01/custom-CLI#uninstall)

Some commands have user interaction and prompt the user with a (yes) question. In order to accept the prompt write `yes` or `y`.
For information about the commands combine the command with the `--help` or `/?` flags. (`cli *command* --help` or `cli *command* /?`)

## set up the cli

 There are two ways:
 - install the code and run `npm run build`
 - download and run setup.exe

## init

Initializes a node project (similarly to 'npm init') by adding to a directory (default is the current one):

init.js             main node server
package.json
public/             publically served folder
    index.html      landing page
    404.html
helpers             obligatory module for the init.js


or initializes a custom cli project for the `cli add` ([add](https://github.com/BRISINGR-01/custom-CLI#add)) by creating a directory with:

a .js/.sh/.cmd/.ps1 file with the same name as the directory
a .txt file with the same name



usage:
`cli init (path to directory) (-y/--yes) (-k/--keep)`
`cli init cli (path to directory) (-y/--yes) (-k/--keep)`

() - optinal

flags:
-y/--yes            accept all suggestions at prompts
-k/--keep           if there are existing files with those names, they will be not be overwritten

## tree
Displays the inside structure of a folder in several ways

usage:
`cli -s (number of spaces) (folderpath)`
`cli tree -s/-o/-j/-a (folderpath)`
`cli tree -f -s/-o/-j/-a (folderpath) (filepath)`

** filepath - the path to the file where the output will be written                               |order doesn't matter
** folderpath - the path to the folder which will be dispayed (the current one is defalut)|
** number of spaces - default is 2
all ** are optional

default:
`cli tree => cli tree -s currentDir`
`cli tree -f => cli tree -fj currentDir currentDir/currentDir.json`

if there is -f/--file flag making an object, the values of the files will be the files' contents

flags:
-s/--spaces     the deeper a file/folder is, the more spaces it has in front of its name
-o/--object     display it as a js object
-j/--json       a stringified json version
-a/--array      display it as an array
-f/--file       the same, but instead of logged onto the console, it is written into a file

## add

Adds a new functionality to the `cli` by adding another argument alongside the existing ones like init, tree, add, uninstall...
For a step by step tutorial visit <https://github.com/BRISINGR-01/custom-CLI#Adding-cusotm-commands>
You can initialize this project with `alex init cli (-y/--yes)`

usage:
`cli add your_command`

* your_command - the name of the new command you want to add - it will be used by calling `alex your_command`

The folder must be named the same as the new command. It must include a .js/.sh/.cmd/.ps1 file and a .txt file, both with the name of the new command
The .js/.sh/.cmd/.ps1 file is the one to be executed with all of the flags after calling `alex your_command`
The .txt file will be logged onto the console when you call your command with the `--help` flag. For example `alex --help your_command`. In this file you can use several variables which will be automatically replaced:
$callerpath => cli
$clipath => $clipath // path to the cli folder


remove
reset
rename
uninstall
