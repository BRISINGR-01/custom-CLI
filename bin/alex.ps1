#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

node "$basedir/cli.js" $PWD $args

exit 0