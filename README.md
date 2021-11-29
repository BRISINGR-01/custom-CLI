# custom-CLI

This cli consists of a couple of predefined commands and allows users to easily add new commands  <br>
Available commands<br>
- [init](https://github.com/BRISINGR-01/custom-CLI#init)  <br>
- [tree](https://github.com/BRISINGR-01/custom-CLI#tree)  <br>
- [add](https://github.com/BRISINGR-01/custom-CLI#add)  <br>
- [remove](https://github.com/BRISINGR-01/custom-CLI#remove)  <br>
- [reset](https://github.com/BRISINGR-01/custom-CLI#reset)  <br>
- [rename](https://github.com/BRISINGR-01/custom-CLI#rename)  <br>
- [uninstall](https://github.com/BRISINGR-01/custom-CLI#uninstall)  <br>

Some commands have user interaction and prompt the user with a (yes) question. In order to accept the prompt write `yes` or `y`.  <br>
For information about the commands combine the command with the `--help` or `/?` flags. (`cli *command* --help` or `cli *command* /?`).  <br>
Created and tested on Windows only.  <br>

## set up the cli<br>

 There are two ways:<br>
 - install the code and run `npm run build`  <br>
 - download and run setup.exe<br>

## init<br>

Initializes a node project (similarly to 'npm init') by adding to a directory (default is the current one):  <br>

init.js             main node server  <br>
package.json<br>
public/             publically served folder  <br>
    index.html      landing page<br>
    404.html<br>
helpers             obligatory module for the init.js  <br>


or initializes a custom cli project for the `cli add` ([add](https://github.com/BRISINGR-01/custom-CLI#add)) by creating a directory with:  <br>

a .js/.sh/.cmd/.ps1 file with the same name as the directory  <br>
a .txt file with the same name<br>



usage:<br>
`cli init (path to directory) (-y/--yes) (-k/--keep)`  <br>
`cli init cli (path to directory) (-y/--yes) (-k/--keep)`  <br>

() - optinal<br>

flags:<br>
-y/--yes            accept all suggestions at prompts  <br>
-k/--keep           if there are existing files with those names, they will be not be overwritten  <br>

## tree<br>
Displays the inside structure of a folder in several ways    <br>

usage:  <br>
`cli -s (number of spaces) (folderpath)`    <br>
`cli tree -s/-o/-j/-a (folderpath)`    <br>
`cli tree -f -s/-o/-j/-a (folderpath) (filepath)`    <br>

** filepath - the path to the file where the output will be written                               |order doesn't matter  <br>
** folderpath - the path to the folder which will be dispayed (the current one is defalut)|  <br>
** number of spaces - default is 2  <br>
all ** are optional<br>

default:<br>
`cli tree => cli tree -s currentDir`  <br>
`cli tree -f => cli tree -fj currentDir currentDir/currentDir.json`  <br>

if there is -f/--file flag making an object, the values of the files will be the files' contents  <br>

flags:<br>
-s/--spaces     the deeper a file/folder is, the more spaces it has in front of its name  <br>
-o/--object     display it as a js object  <br>
-j/--json       a stringified json version  <br>
-a/--array      display it as an array  <br>
-f/--file       the same, but instead of logged onto the console, it is written into a file  <br>

## add<br>

Adds a new functionality to the `cli` by adding another argument alongside the existing ones like init, tree, add, uninstall...  <br>
For a step by step tutorial visit <https://github.com/BRISINGR-01/custom-CLI#adding-custom-commands><br>
You can initialize this project with `alex init cli (-y/--yes)`  <br>

usage:<br>
`cli add your_command`<br>

* your_command - the name of the new command you want to add - it will be used by calling `alex your_command`  <br>

The folder must be named the same as the new command. It must include a .js/.sh/.cmd/.ps1 file and a .txt file, both with the name of the new command  <br>
The .js/.sh/.cmd/.ps1 file is the one to be executed with all of the flags after calling `alex your_command`  <br>
The .txt file will be logged onto the console when you call your command with the `--help` flag. For example `alex --help your_command`. In this file you can use several variables which will be automatically replaced:  <br>
$callerpath => cli<br>
$clipath => $clipath // path to the cli folder  <br>


## remove<br>

Removes possible sub commands of this cli  <br>
ex: `alex remove init`  <br>

## reset<br>

This will reset the cli to its original state in <https://github.com/BRISINGR-01/custom-CLI>  <br>

## rename<br>

Change the `cli` to something else  <br>
Note! the `cli` will not work anymore, so the only way to access the cli will be to type the new command in a terminal  <br>

## uninstall<br>

This will uninstall the whole cli  <br>

## Adding custom commands<br>

You can easily automize tasks or whatever you want by typing `cli *command* *arguments*`.<br>
First start the project with `cli init cli`, give the command a name and choose whether the file to be run should be .js, .sh, .cmd or .ps1. Afterwards you will be left with a folder with two files: a .txt and the file which will be run with the arguments from the command line. The .txt file will be displayed when you type `cli *command* --help` or `cli *command* /?`.
