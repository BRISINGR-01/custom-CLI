#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$basedir="$basedir/../"

node "$basedir/cli.js" $PWD $args

exit 0